import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function ChangePasswordModal({ open, onClose, onSubmit }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const validate = () => {
    const e = {};
    if (!currentPassword) e.currentPassword = "Requis";
    if (!newPassword) e.newPassword = "Requis";
    if (newPassword && newPassword.length < 8) e.newPassword = "8 caractères minimum";
    if (newPassword && confirmPassword !== newPassword) e.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onSubmit?.({ currentPassword, newPassword });
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Changer le mot de passe</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: 360 }}>
          <TextField
            label="Mot de passe actuel"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={Boolean(errors.currentPassword)}
            helperText={errors.currentPassword}
            fullWidth
          />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={Boolean(errors.newPassword)}
            helperText={errors.newPassword}
            fullWidth
          />
          <TextField
            label="Confirmer le nouveau mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
} 