import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Typography, Button } from "@mui/material";
import GenericDataTable from "../components/GenericDataTable";
import CollaborateurModal from "../components/CollaborateurModal";
import { getCollaborateurs, addCollaborateur, updateCollaborateur, deleteCollaborateur } from "../Services/collaborateursService";
import { getRoles } from "../Services/rolesService";
import theme from "../theme";

const columns = [
  { field: "nom", headerName: "Nom" },
  { field: "email", headerName: "Email" },
  { field: "roleLabel", headerName: "Rôle" },
];

function extractRoleIdFromIri(iri) {
  if (typeof iri === "string") {
    const parts = iri.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }
  if (iri && iri.id) return String(iri.id);
  return "";
}

function mapCollaborateurForUI(collaborateur, rolesMap) {
  const roleId = extractRoleIdFromIri(collaborateur.roleId);
  const roleLabel = rolesMap[roleId] || roleId || "";
  return { ...collaborateur, role: roleId, roleLabel };
}

export default function AdminPage() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [rolesMap, setRolesMap] = useState({});
  const [rolesList, setRolesList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const roles = await getRoles();
        const map = roles.reduce((acc, r) => {
          acc[String(r.id)] = r.libelle || String(r.id);
          return acc;
        }, {});
        if (!isMounted) return;
        setRolesMap(map);
        setRolesList(roles);
        const list = await getCollaborateurs();
        if (!isMounted) return;
        setCollaborateurs(list.map((c) => mapCollaborateurForUI(c, map)));
      } catch (e) {
        if (!isMounted) return;
        setCollaborateurs([]);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
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
        const mapped = mapCollaborateurForUI(updated, rolesMap);
        setCollaborateurs(collaborateurs.map((c) => (c.id === mapped.id ? mapped : c)));
        setModalOpen(false);
      });
    } else {
      addCollaborateur(form).then((created) => {
        const mapped = mapCollaborateurForUI(created, rolesMap);
        setCollaborateurs([...collaborateurs, mapped]);
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
          bordered
          headerAlign="center"
          cellAlign="center"
          headerSx={{ fontSize: 14 }}
          cellSx={{ fontSize: 13 }}
          headerSx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}
        />
        <CollaborateurModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editData}
          roles={rolesList}
        />
      </Box>
    </div>
  );
}