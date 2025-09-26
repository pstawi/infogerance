import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Typography, Button } from "@mui/material";
import GenericDataTable from "../components/GenericDataTable";
import ContactModal from "../components/ContactModal";
import { getContacts, addContact, updateContact, deleteContact } from "../Services/contactsService";
import { getClients } from "../Services/clientsService";
import { useToast } from "../context/ToastContext";

const columns = [
  { field: "nom", headerName: "Nom" },
  { field: "prenom", headerName: "Prénom" },
  { field: "email", headerName: "Email" },
  { field: "telephone", headerName: "Téléphone" },
  { field: "clientLabel", headerName: "Client" },
];

function extractIdFromIri(iri) {
  if (typeof iri === "string") {
    const parts = iri.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }
  if (iri && iri.id) return String(iri.id);
  return "";
}

function mapContactForUI(contact, clientsMap) {
  const clientId = extractIdFromIri(contact.clientId);
  const clientLabel = clientsMap[clientId] || clientId || "";
  return { ...contact, client: clientId, clientLabel };
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [clientsMap, setClientsMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const clients = await getClients();
        if (!mounted) return;
        setClientsList(clients);
        const map = clients.reduce((acc, c) => {
          acc[String(c.id)] = c.nom || String(c.id);
          return acc;
        }, {});
        setClientsMap(map);
        const list = await getContacts();
        if (!mounted) return;
        setContacts(list.map((ct) => mapContactForUI(ct, map)));
      } catch (e) {
        if (!mounted) return;
        setContacts([]);
        showToast("Erreur lors du chargement des contacts", { severity: 'error' });
      }
    }
    load();
    return () => {
      mounted = false;
    };
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
    deleteContact(row.id)
      .then(() => {
        setContacts(contacts.filter((c) => c.id !== row.id));
        showToast("Contact supprimé", { severity: 'success' });
      })
      .catch(() => showToast("Suppression échouée", { severity: 'error' }));
  };

  const handleSave = (form) => {
    if (editData) {
      updateContact(editData.id, form)
        .then((updated) => {
          const mapped = mapContactForUI(updated, clientsMap);
          setContacts(contacts.map((c) => (c.id === mapped.id ? mapped : c)));
          setModalOpen(false);
          showToast("Contact mis à jour", { severity: 'success' });
        })
        .catch(() => showToast("Mise à jour échouée", { severity: 'error' }));
    } else {
      addContact(form)
        .then((created) => {
          const mapped = mapContactForUI(created, clientsMap);
          setContacts([...contacts, mapped]);
          setModalOpen(false);
          showToast("Contact ajouté", { severity: 'success' });
        })
        .catch(() => showToast("Création échouée", { severity: 'error' }));
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gestion des contacts
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
          Ajouter un contact
        </Button>
        <GenericDataTable 
          columns={columns} 
          rows={contacts} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          bordered
          headerAlign="center"
          cellAlign="center"
          headerSx={{ fontSize: 14, backgroundColor: 'primary.main', color: 'primary.contrastText' }}
          cellSx={{ fontSize: 13 }}
        />
        <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initialData={editData} clients={clientsList} />
      </Box>
    </div>
  );
} 