import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Typography, Button, IconButton, Stack, Chip } from "@mui/material";
import GenericDataTable from "../components/GenericDataTable";
import TicketModal from "../components/TicketModal";
import { getTickets, addTicket, updateTicket, deleteTicket } from "../Services/ticketsService";
import { getClients } from "../Services/clientsService";
import { getContacts } from "../Services/contactsService";
import { getCollaborateurs } from "../Services/collaborateursService";
import { getStatuts } from "../Services/statutsService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const baseColumns = [
  { field: "numeroTicket", headerName: "N°" },
  { field: "titre", headerName: "Titre" },
  { field: "dateCreation", headerName: "Créé le" },
  { field: "statutLabel", headerName: "Statut" },
  { field: "actions", headerName: "" },
];

function extractIdFromIri(iri) {
  if (typeof iri === "string") {
    const parts = iri.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }
  if (iri && iri.id) return String(iri.id);
  return "";
}

function mapTicketForUI(ticket, statutsMap) {
  const statutId = extractIdFromIri(ticket.statutId);
  const statutLabel = statutsMap[statutId] || statutId || "";
  return { ...ticket, statut: statutId, statutLabel };
}

function chipColorForStatut(label) {
  if (!label) return 'default';
  const l = label.toLowerCase();
  if (l.includes('demande')) return 'default';
  if (l.includes('affect')) return 'info';
  if (l.includes('cours')) return 'warning';
  if (l.includes('attente')) return 'secondary';
  if (l.includes('termin')) return 'success';
  if (l.includes('réouvr') || l.includes('reouvr')) return 'error';
  return 'default';
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [statuts, setStatuts] = useState([]);
  const [statutsMap, setStatutsMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const columns = useMemo(() => {
    return baseColumns.map((c) => c.field !== 'statutLabel' ? c : {
      ...c,
      renderCell: (row) => <Chip label={row.statutLabel} color={chipColorForStatut(row.statutLabel)} size="small" />,
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [st, cl, ct, co, tk] = await Promise.all([
          getStatuts(),
          getClients(),
          getContacts(),
          getCollaborateurs(),
          getTickets(),
        ]);
        if (!mounted) return;
        setStatuts(st);
        const smap = st.reduce((acc, s) => {
          acc[String(s.id)] = s.libelle || String(s.id);
          return acc;
        }, {});
        setStatutsMap(smap);
        setClients(cl);
        setContacts(ct);
        setCollaborateurs(co);
        setTickets(tk.map((t) => mapTicketForUI(t, smap)));
      } catch (e) {
        if (!mounted) return;
        setTickets([]);
        showToast("Erreur lors du chargement des tickets", { severity: 'error' });
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    deleteTicket(row.id)
      .then(() => {
        setTickets(tickets.filter((t) => t.id !== row.id));
        showToast("Ticket supprimé", { severity: 'success' });
      })
      .catch(() => showToast("Suppression échouée", { severity: 'error' }));
  };

  const handleSave = (form) => {
    if (editData) {
      updateTicket(editData.id, form)
        .then((updated) => {
          const mapped = mapTicketForUI(updated, statutsMap);
          setTickets(tickets.map((t) => (t.id === mapped.id ? mapped : t)));
          setModalOpen(false);
          showToast("Ticket mis à jour", { severity: 'success' });
        })
        .catch(() => showToast("Mise à jour échouée", { severity: 'error' }));
    } else {
      addTicket(form)
        .then((created) => {
          const mapped = mapTicketForUI(created, statutsMap);
          setTickets([...tickets, mapped]);
          setModalOpen(false);
          showToast("Ticket créé", { severity: 'success' });
        })
        .catch(() => showToast("Création échouée", { severity: 'error' }));
    }
  };

  const rowsWithActions = tickets.map((t) => ({
    ...t,
    actions: (
      <Stack direction="row" spacing={1}>
        <IconButton size="small" onClick={() => navigate(`/tickets/${t.id}`)}>
          <VisibilityIcon />
        </IconButton>
      </Stack>
    ),
  }));

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gestion des tickets
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
          Créer un ticket
        </Button>
        <GenericDataTable columns={columns} rows={rowsWithActions} onEdit={handleEdit} onDelete={handleDelete} />
        <TicketModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editData}
          clients={clients}
          contacts={contacts}
          collaborateurs={collaborateurs}
          statuts={statuts}
        />
      </Box>
    </div>
  );
} 