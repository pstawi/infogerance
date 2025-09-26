import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Typography, Button, IconButton, Stack, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Menu, Link } from "@mui/material";
import GenericDataTable from "../components/GenericDataTable";
import TicketModal from "../components/TicketModal";
import { getTickets, addTicket, updateTicket, deleteTicket } from "../Services/ticketsService";
import { getClients } from "../Services/clientsService";
import { getContacts } from "../Services/contactsService";
import { getCollaborateurs } from "../Services/collaborateursService";
import { getStatuts } from "../Services/statutsService";
import { uploadTicketAttachment, getTicketAttachments, deleteTicketAttachment } from "../Services/attachmentsService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/date";
import { useAuth } from "../context/AuthContext";

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
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [attMenuAnchor, setAttMenuAnchor] = useState(null);
  const [attMenuTicketId, setAttMenuTicketId] = useState(null);
  const [attMenuItems, setAttMenuItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { user } = useAuth();
  const isCollaborateur = Array.isArray(user?.roles) && user.roles.some((r) => r.startsWith('ROLE_'));

  const columns = useMemo(() => {
    return baseColumns.map((c) => {
      if (c.field === 'statutLabel') {
        return { ...c, renderCell: (row) => <Chip label={row.statutLabel} color={chipColorForStatut(row.statutLabel)} size="small" /> };
      }
      if (c.field === 'dateCreation') {
        return { ...c, renderCell: (row) => formatDate(row.dateCreation) };
      }
      return c;
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

  useEffect(() => {
    if (location.state && location.state.openCreate) {
      setEditData(null);
      setModalOpen(true);
    }
  }, [location.state]);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    if (!isCollaborateur) return;
    setEditData(row);
    setModalOpen(true);
  };

  const handleDelete = (row) => {
    if (!isCollaborateur) return;
    deleteTicket(row.id)
      .then(() => {
        setTickets(tickets.filter((t) => t.id !== row.id));
        showToast("Ticket supprimé", { severity: 'success' });
      })
      .catch(() => showToast("Suppression échouée", { severity: 'error' }));
  };

  const uploadFiles = async (ticketId, files) => {
    try {
      for (const f of files) {
        await uploadTicketAttachment(ticketId, f);
      }
      showToast("Pièces jointes envoyées", { severity: 'success' });
    } catch (e) {
      showToast("Échec de l’upload des pièces jointes", { severity: 'error' });
    }
  };

  const handleSave = (form) => {
    if (editData) {
      return updateTicket(editData.id, form)
        .then((updated) => {
          const mapped = mapTicketForUI(updated, statutsMap);
          setTickets(tickets.map((t) => (t.id === mapped.id ? mapped : t)));
          setModalOpen(false);
          showToast("Ticket mis à jour", { severity: 'success' });
          return mapped;
        })
        .catch(() => { showToast("Mise à jour échouée", { severity: 'error' }); });
    } else {
      return addTicket(form)
        .then((created) => {
          const mapped = mapTicketForUI(created, statutsMap);
          setTickets([...tickets, mapped]);
          setModalOpen(false);
          showToast("Ticket créé", { severity: 'success' });
          return mapped;
        })
        .catch(() => { showToast("Création échouée", { severity: 'error' }); });
    }
  };

  const openAttachmentsMenu = async (event, ticket) => {
    setAttMenuAnchor(event.currentTarget);
    setAttMenuTicketId(ticket.id);
    try {
      const items = await getTicketAttachments(ticket.id);
      setAttMenuItems(items);
    } catch {
      setAttMenuItems([]);
    }
  };

  const closeAttachmentsMenu = () => {
    setAttMenuAnchor(null);
    setAttMenuTicketId(null);
    setAttMenuItems([]);
  };

  const handleDeleteAttachment = async (att) => {
    try {
      await deleteTicketAttachment(att.id);
      setAttMenuItems(attMenuItems.filter((a) => a.id !== att.id));
      showToast("Pièce jointe supprimée", { severity: 'success' });
    } catch {
      showToast("Échec de la suppression", { severity: 'error' });
    }
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return tickets.filter((t) => {
      const matchSearch = !s || (String(t.numeroTicket).toLowerCase().includes(s) || String(t.titre || '').toLowerCase().includes(s));
      const matchStatut = !statutFilter || String(t.statut) === String(statutFilter);
      return matchSearch && matchStatut;
    });
  }, [tickets, search, statutFilter]);

  const rowsWithActions = filtered.map((t) => ({
    ...t,
    actions: (
      <Stack direction="row" spacing={1}>
        <IconButton size="small" onClick={() => navigate(`/tickets/${t.id}`)}>
          <VisibilityIcon />
        </IconButton>
        <IconButton size="small" onClick={(e) => openAttachmentsMenu(e, t)}>
          <AttachFileIcon />
        </IconButton>
        {isCollaborateur && (
          <>
            <IconButton size="small" onClick={() => handleEdit(t)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => handleDelete(t)}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
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
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }} sx={{ mb: 2 }}>
          <TextField label="Rechercher (N° ou Titre)" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ maxWidth: 360 }} />
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="statut-filter-label">Filtrer par statut</InputLabel>
            <Select labelId="statut-filter-label" label="Filtrer par statut" value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}>
              <MenuItem value="">Tous</MenuItem>
              {statuts.map((s) => (
                <MenuItem key={s.id} value={String(s.id)}>{s.libelle}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
          Créer un ticket
        </Button>
        <GenericDataTable columns={columns} rows={rowsWithActions} />
        <Menu anchorEl={attMenuAnchor} open={Boolean(attMenuAnchor)} onClose={closeAttachmentsMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
          {attMenuItems.length === 0 && <MenuItem disabled>Aucune pièce jointe</MenuItem>}
          {attMenuItems.map((att) => (
            <MenuItem key={att.id} sx={{ display: 'flex', gap: 1 }}>
              <Link href={att.url} target="_blank" rel="noopener" underline="hover" sx={{ flex: 1 }}>{att.originalName || att.fileName}</Link>
              {isCollaborateur && (
                <IconButton size="small" color="error" onClick={() => handleDeleteAttachment(att)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </MenuItem>
          ))}
        </Menu>
        <TicketModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          onUploadFiles={uploadFiles}
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