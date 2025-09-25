import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../context/AuthContext";

export default function TicketModal({ open, onClose, onSave, initialData, clients = [], contacts = [], collaborateurs = [], statuts = [] }) {
  const { user } = useAuth();
  const isCollaborateur = Array.isArray(user?.roles) && user.roles.some((r) => r.includes("ROLE_"));

  const [form, setForm] = useState({ titre: "", description: "", client: "", contact: "", collaborateur: "", statut: "", tpsResolution: "" });
  const [errors, setErrors] = useState({ titre: "", description: "" });

  useEffect(() => {
    if (initialData) {
      setForm({
        titre: initialData.titre || "",
        description: initialData.description || "",
        client: initialData.client || "",
        contact: initialData.contact || "",
        collaborateur: initialData.collaborateur || "",
        statut: initialData.statut || "",
        tpsResolution: initialData.tpsResolution ?? "",
      });
      setErrors({ titre: "", description: "" });
    } else {
      setForm({ titre: "", description: "", client: "", contact: "", collaborateur: "", statut: "", tpsResolution: "" });
      setErrors({ titre: "", description: "" });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "titre" || e.target.name === "description") {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = () => {
    const nextErrors = { titre: "", description: "" };
    if (!form.titre) nextErrors.titre = "Titre requis";
    if (!form.description) nextErrors.description = "Description requise";
    setErrors(nextErrors);
    if (nextErrors.titre || nextErrors.description) return;
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Modifier" : "Créer"} un ticket</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="Titre" name="titre" value={form.titre} onChange={handleChange} fullWidth required error={Boolean(errors.titre)} helperText={errors.titre} />
        <TextField margin="dense" label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline minRows={3} required error={Boolean(errors.description)} helperText={errors.description} />
        <FormControl fullWidth margin="dense">
          <InputLabel id="statut-label">Statut</InputLabel>
          <Select labelId="statut-label" label="Statut" name="statut" value={form.statut} onChange={handleChange} disabled={!isCollaborateur}>
            {statuts.map((s) => (
              <MenuItem key={s.id} value={String(s.id)}>{s.libelle || s.id}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="client-label">Client</InputLabel>
          <Select labelId="client-label" label="Client" name="client" value={form.client} onChange={handleChange}>
            {clients.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>{c.nom || c.id}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="contact-label">Contact</InputLabel>
          <Select labelId="contact-label" label="Contact" name="contact" value={form.contact} onChange={handleChange}>
            {contacts.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>{`${c.prenom || ''} ${c.nom || ''}`.trim() || c.id}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {isCollaborateur && (
          <FormControl fullWidth margin="dense">
            <InputLabel id="collab-label">Collaborateur</InputLabel>
            <Select labelId="collab-label" label="Collaborateur" name="collaborateur" value={form.collaborateur} onChange={handleChange}>
              {collaborateurs.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>{`${c.prenom || ''} ${c.nom || ''}`.trim() || c.id}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {isCollaborateur && (
          <TextField margin="dense" label="Temps de résolution (min)" name="tpsResolution" type="number" value={form.tpsResolution} onChange={handleChange} fullWidth />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Modifier" : "Créer"}</Button>
      </DialogActions>
    </Dialog>
  );
} 