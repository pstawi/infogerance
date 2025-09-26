import { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Box, Chip, CircularProgress, Divider, Grid, Paper, Stack, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { getTicket, updateTicket } from "../Services/ticketsService";
import { getStatuts } from "../Services/statutsService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function labelFromIri(iri) {
  if (!iri || typeof iri !== 'string') return '';
  const parts = iri.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

function formatDate(d) {
  if (!d) return '';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleString();
  } catch {
    return d;
  }
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isCollaborateur = Array.isArray(user?.roles) && user.roles.some((r) => r.startsWith('ROLE_'));

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statuts, setStatuts] = useState([]);
  const [statutId, setStatutId] = useState("");
  const [tpsResolution, setTpsResolution] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const statutsMap = useMemo(() => statuts.reduce((acc, s) => ({ ...acc, [String(s.id)]: s.libelle }), {}), [statuts]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [st, data] = await Promise.all([getStatuts(), getTicket(id)]);
        if (!mounted) return;
        setStatuts(st);
        setTicket(data);
        setStatutId(labelFromIri(data.statutId));
        setTpsResolution(data.tpsResolution ?? "");
      } catch (e) {
        if (!mounted) return;
        setError("Impossible de charger le ticket");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const currentStatutLabel = statutsMap[String(statutId)] || '';
  const requireTps = currentStatutLabel && currentStatutLabel.toLowerCase() === 'terminée';

  const handleSave = async () => {
    setFormError("");
    if (requireTps && (tpsResolution === "" || Number.isNaN(Number(tpsResolution)))) {
      setFormError("Temps de résolution requis pour le statut Terminée.");
      return;
    }
    try {
      setSaving(true);
      const payload = { statut: statutId };
      if (tpsResolution !== "") {
        payload.tpsResolution = Number(tpsResolution);
      }
      const updated = await updateTicket(id, payload);
      setTicket(updated);
      showToast("Statut mis à jour", { severity: 'success' });
    } catch (e) {
      setFormError("Échec de la mise à jour du statut");
      showToast("Échec de la mise à jour du statut", { severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ height: '60vh' }}>
            <CircularProgress />
          </Stack>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : ticket ? (
          <Stack gap={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack>
                <Typography variant="h6">Ticket {ticket.numeroTicket}</Typography>
                <Typography variant="body2" color="text.secondary">Créé le {formatDate(ticket.dateCreation)}</Typography>
              </Stack>
              <Chip color="primary" label={`Statut: ${statutsMap[String(labelFromIri(ticket.statutId))] || labelFromIri(ticket.statutId)}`} />
            </Stack>

            {isCollaborateur && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Actions collaborateur</Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <FormControl sx={{ minWidth: 220 }}>
                    <InputLabel id="statut-label">Statut</InputLabel>
                    <Select labelId="statut-label" label="Statut" value={statutId} onChange={(e) => setStatutId(e.target.value)}>
                      {statuts.map((s) => (
                        <MenuItem key={s.id} value={String(s.id)}>{s.libelle}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {requireTps && (
                    <TextField
                      label="Temps de résolution (min)"
                      type="number"
                      value={tpsResolution}
                      onChange={(e) => setTpsResolution(e.target.value)}
                      sx={{ minWidth: 220 }}
                    />
                  )}
                  <Button variant="contained" onClick={handleSave} disabled={saving}>
                    Enregistrer
                  </Button>
                </Stack>
                {formError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>{formError}</Typography>
                )}
              </Paper>
            )}

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Informations</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Titre</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{ticket.titre}</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Description</Typography>
              <Typography variant="body2" whiteSpace="pre-wrap">{ticket.description}</Typography>
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Participants</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">Client: {labelFromIri(ticket.clientId)}</Typography>
                  <Typography variant="body2">Contact: {labelFromIri(ticket.contactId)}</Typography>
                  <Typography variant="body2">Collaborateur: {labelFromIri(ticket.collaborateurId)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Dates</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2">Création: {formatDate(ticket.dateCreation)}</Typography>
                  {ticket.dateModif && (
                    <Typography variant="body2">Dernière modification: {formatDate(ticket.dateModif)}</Typography>
                  )}
                  {ticket.tpsResolution != null && (
                    <Typography variant="body2">Temps de résolution: {ticket.tpsResolution} min</Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Stack direction="row" gap={1}>
              <Button component={RouterLink} to="/tickets" variant="outlined">Retour</Button>
            </Stack>
          </Stack>
        ) : null}
      </Box>
    </div>
  );
} 