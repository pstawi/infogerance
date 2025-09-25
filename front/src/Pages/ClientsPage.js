import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Typography, Button } from "@mui/material";
import GenericDataTable from "../components/GenericDataTable";
import ClientModal from "../components/ClientModal";
import { getClients, addClient, updateClient, deleteClient } from "../Services/clientsService";
import theme from "../theme";

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

  useEffect(() => {
    getClients().then(setClients).catch(() => setClients([]));
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
    deleteClient(row.id).then(() => setClients(clients.filter((c) => c.id !== row.id)));
  };

  const handleSave = (form) => {
    if (editData) {
      updateClient(editData.id, form).then((updated) => {
        setClients(clients.map((c) => (c.id === updated.id ? updated : c)));
        setModalOpen(false);
      });
    } else {
      addClient(form).then((created) => {
        setClients([...clients, created]);
        setModalOpen(false);
      });
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
        headerSx={{ fontSize: 14 }}
        cellSx={{ fontSize: 13 }}
        headerSx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
        />
        <ClientModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initialData={editData} />
      </Box>
    </div>
  );
} 