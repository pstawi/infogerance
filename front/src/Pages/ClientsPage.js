import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Typography, Button } from "@mui/material";
import GenericDataTable from "../components/GenericDataTable";
import ClientModal from "../components/ClientModal";
import { getClients, addClient, updateClient, deleteClient } from "../Services/clientsService";
import { useToast } from "../context/ToastContext";

const columns = [
  { field: "nom", headerName: "Nom" },
  { field: "adresse", headerName: "Adresse" },
  { field: "telephone", headerName: "Téléphone" },
  { field: "email", headerName: "Email" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch(() => {
        setClients([]);
        showToast("Erreur lors du chargement des clients", { severity: 'error' });
      });
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
    deleteClient(row.id)
      .then(() => {
        setClients(clients.filter((c) => c.id !== row.id));
        showToast("Client supprimé", { severity: 'success' });
      })
      .catch(() => showToast("Suppression échouée", { severity: 'error' }));
  };

  const handleSave = (form) => {
    if (editData) {
      updateClient(editData.id, form)
        .then((updated) => {
          setClients(clients.map((c) => (c.id === updated.id ? updated : c)));
          setModalOpen(false);
          showToast("Client mis à jour", { severity: 'success' });
        })
        .catch(() => showToast("Mise à jour échouée", { severity: 'error' }));
    } else {
      addClient(form)
        .then((created) => {
          setClients([...clients, created]);
          setModalOpen(false);
          showToast("Client ajouté", { severity: 'success' });
        })
        .catch(() => showToast("Création échouée", { severity: 'error' }));
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gestion des clients
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
          Ajouter un client
        </Button>
        <GenericDataTable 
          columns={columns} 
          rows={clients} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          bordered
          headerAlign="center"
          cellAlign="center"
          headerSx={{ fontSize: 14, backgroundColor: 'primary.main', color: 'primary.contrastText' }}
          cellSx={{ fontSize: 13 }}
        />
        <ClientModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initialData={editData} />
      </Box>
    </div>
  );
} 