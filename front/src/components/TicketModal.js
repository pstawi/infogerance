import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../context/AuthContext";

export default function TicketModal({ open, onClose, onSave, initialData, clients = [], contacts = [], collaborateurs = [], statuts = [], onUploadFiles }) {
  const { user } = useAuth();
  const isCollaborateur = Array.isArray(user?.roles) && user.roles.some((r) => r.includes("ROLE_"));

  const [form, setForm] = useState({ titre: "", description: "", client: "", contact: "", collaborateur: "", statut: "", tpsResolution: "" });
  const [errors, setErrors] = useState({ titre: "", description: "" });
  const [files, setFiles] = useState([]);

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
      setFiles([]);
    } else {
      setForm({ titre: "", description: "", client: "", contact: "", collaborateur: "", statut: "", tpsResolution: "" });
      setErrors({ titre: "", description: "" });
      setFiles([]);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "titre" || e.target.name === "description") {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async () => {
    const nextErrors = { titre: "", description: "" };
    if (!form.titre) nextErrors.titre = "Titre requis";
    if (!form.description) nextErrors.description = "Description requise";
    setErrors(nextErrors);
    if (nextErrors.titre || nextErrors.description) return;
    const result = await onSave(form);
    if (result && result.id && files.length && onUploadFiles) {
      await onUploadFiles(result.id, files);
    }
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
          <TextField margin="dense" label="Temps de résolution (min)" name="tpsResolution" type="number" value={form.tpsResolution} onChange={handleChange} fullWidth />
        )}
        <TextField margin="dense" label="Pièces jointes" type="file" inputProps={{ multiple: true }} onChange={handleFiles} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained">{initialData ? "Modifier" : "Créer"}</Button>
      </DialogActions>
    </Dialog>
  );
} 