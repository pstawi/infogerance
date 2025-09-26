import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { getMe, updateMyProfile } from "../Services/profileService";
import { useToast } from "../context/ToastContext";

export default function ProfilePage() {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    getMe()
      .then((me) => { if (mounted) setForm({ nom: me.nom || "", prenom: me.prenom || "", email: me.email || "", telephone: me.telephone || "" }); })
      .catch(() => showToast("Impossible de charger le profil", { severity: 'error' }))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateMyProfile(form);
      showToast("Profil mis à jour", { severity: 'success' });
    } catch (e) {
      showToast("Échec de la mise à jour", { severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <TopBar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Mon profil</Typography>
          <Paper sx={{ p: 2, maxWidth: 560 }}>
            <Stack spacing={2}>
              <TextField label="Nom" name="nom" value={form.nom} onChange={handleChange} fullWidth />
              <TextField label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} fullWidth />
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth />
              <TextField label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} fullWidth />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleSave} disabled={saving}>Enregistrer</Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </div>
  );
} 