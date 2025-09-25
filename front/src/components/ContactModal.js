import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function ContactModal({ open, onClose, onSave, initialData, clients = [] }) {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", password: "", client: "" });
  const [errors, setErrors] = useState({ password: "" });

  useEffect(() => {
    if (initialData) {
      setForm({
        nom: initialData.nom || "",
        prenom: initialData.prenom || "",
        email: initialData.email || "",
        telephone: initialData.telephone || "",
        password: "",
        client: initialData.client || "",
      });
      setErrors({ password: "" });
    } else {
      setForm({ nom: "", prenom: "", email: "", telephone: "", password: "", client: "" });
      setErrors({ password: "" });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleSubmit = () => {
    if (!initialData && !form.password) {
      setErrors({ ...errors, password: "Le mot de passe est requis pour la création." });
      return;
    }
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Modifier" : "Ajouter"} un contact</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="Nom" name="nom" value={form.nom} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth />
        <TextField margin="dense" label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} fullWidth />
        <FormControl fullWidth margin="dense">
          <InputLabel id="client-label">Client</InputLabel>
          <Select labelId="client-label" label="Client" name="client" value={form.client} onChange={handleChange}>
            {clients.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>{c.nom || c.id}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Mot de passe"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          required={!initialData}
          error={Boolean(errors.password)}
          helperText={errors.password || (initialData ? "Laisser vide pour ne pas changer" : "")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Modifier" : "Ajouter"}</Button>
      </DialogActions>
    </Dialog>
  );
} 