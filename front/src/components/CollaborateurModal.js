import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";

export default function CollaborateurModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ nom: "", email: "", role: "" });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ nom: "", email: "", role: "" });
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Modifier" : "Ajouter"} un collaborateur</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nom"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Rôle"
          name="role"
          value={form.role}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? "Modifier" : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}