import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";

export default function ClientModal({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({ nom: "", adresse: "", telephone: "", email: "" });

  useEffect(() => {
    if (initialData) {
      setForm({
        nom: initialData.nom || "",
        adresse: initialData.adresse || "",
        telephone: initialData.telephone || "",
        email: initialData.email || "",
      });
    } else {
      setForm({ nom: "", adresse: "", telephone: "", email: "" });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Modifier" : "Ajouter"} un client</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="Nom" name="nom" value={form.nom} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Adresse" name="adresse" value={form.adresse} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Modifier" : "Ajouter"}</Button>
      </DialogActions>
    </Dialog>
  );
} 