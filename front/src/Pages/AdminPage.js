import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Typography, Button } from "@mui/material";
import GenericDataTable from "../components/GenericDataTable";
import CollaborateurModal from "../components/CollaborateurModal";
import { getCollaborateurs, addCollaborateur, updateCollaborateur, deleteCollaborateur } from "../Services/collaborateursService";

const columns = [
  { field: "nom", headerName: "Nom" },
  { field: "email", headerName: "Email" },
  { field: "role", headerName: "Rôle" },
];

export default function AdminPage() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    getCollaborateurs()
      .then(setCollaborateurs)
      .catch(() => setCollaborateurs([]));
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (collab) => {
    setEditData(collab);
    setModalOpen(true);
  };

  const handleDelete = (collab) => {
    deleteCollaborateur(collab.id).then(() =>
      setCollaborateurs(collaborateurs.filter((c) => c.id !== collab.id))
    );
  };

  const handleSave = (form) => {
    if (editData) {
      updateCollaborateur(editData.id, form).then((updated) => {
        setCollaborateurs(collaborateurs.map((c) => (c.id === updated.id ? updated : c)));
        setModalOpen(false);
      });
    } else {
      addCollaborateur(form).then((created) => {
        setCollaborateurs([...collaborateurs, created]);
        setModalOpen(false);
      });
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Gestion des collaborateurs
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mb: 2 }}>
          Ajouter un collaborateur
        </Button>
        <GenericDataTable
          columns={columns}
          rows={collaborateurs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <CollaborateurModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editData}
        />
      </Box>
    </div>
  );
}