import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem, Typography, Stack, Chip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TopBar({ onOpenChangePassword }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const primaryRole = useMemo(() => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const main = roles.find((r) => r !== 'ROLE_USER') || roles[0] || '';
    return main.replace('ROLE_', '') || '';
  }, [user]);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const handleChangePassword = () => {
    handleClose();
    onOpenChangePassword && onOpenChangePassword();
  };

  const handleAssistance = () => {
    navigate("/tickets", { state: { openCreate: true } });
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Toolbar>
        <Box sx={{ flex: 1 }} />
        <Button variant="contained" color="primary" startIcon={<HelpOutlineIcon />} onClick={handleAssistance} sx={{ mr: 1 }}>
          Demande d’assistance
        </Button>
        <IconButton color="inherit" onClick={handleMenu}>
          <AccountCircleIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <MenuItem disabled>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">{user?.prenom} {user?.nom} ({user?.email})</Typography>
              {primaryRole && <Chip label={primaryRole} size="small" />}
            </Stack>
          </MenuItem>
          <MenuItem onClick={handleChangePassword}>Changer le mot de passe</MenuItem>
          <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
} 