import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Typography, Button } from "@mui/material";
import GenericDataTable from "../components/GenericDataTable";
import TicketModal from "../components/TicketModal";
import { getTickets, addTicket, updateTicket, deleteTicket } from "../Services/ticketsService";
import { getClients } from "../Services/clientsService";
import { getContacts } from "../Services/contactsService";
import { getCollaborateurs } from "../Services/collaborateursService";
import { getStatuts } from "../Services/statutsService";

const columns = [
  { field: "numeroTicket", headerName: "N°" },
  { field: "titre", headerName: "Titre" },
  { field: "dateCreation", headerName: "Créé le" },
  { field: "statutLabel", headerName: "Statut" },
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

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [statuts, setStatuts] = useState([]);
  const [statutsMap, setStatutsMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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
    deleteTicket(row.id).then(() => setTickets(tickets.filter((t) => t.id !== row.id)));
  };

  const handleSave = (form) => {
    if (editData) {
      updateTicket(editData.id, form).then((updated) => {
        const mapped = mapTicketForUI(updated, statutsMap);
        setTickets(tickets.map((t) => (t.id === mapped.id ? mapped : t)));
        setModalOpen(false);
      });
    } else {
      addTicket(form).then((created) => {
        const mapped = mapTicketForUI(created, statutsMap);
        setTickets([...tickets, mapped]);
        setModalOpen(false);
      });
    }
  };

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
        <GenericDataTable columns={columns} rows={tickets} onEdit={handleEdit} onDelete={handleDelete} />
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