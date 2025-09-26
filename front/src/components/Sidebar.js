import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import DevicesIcon from "@mui/icons-material/Devices";
import WarningIcon from "@mui/icons-material/Warning";
import { Link, useLocation } from "react-router-dom";
import defaultLogo from "../assets/logo.jpg";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { text: "Tickets", icon: <ConfirmationNumberIcon />, path: "/tickets", requiresCollaborateur: false },
  { text: "Collaborateurs", icon: <PeopleIcon />, path: "/admin", requiresCollaborateur: true },
  { text: "Clients", icon: <DevicesIcon />, path: "/clients", requiresCollaborateur: true },
  { text: "Contacts", icon: <PeopleIcon />, path: "/contacts", requiresCollaborateur: true },
];

const defaultColors = {
  background: '#313635',
  text: '#ffffff',
  divider: '#424748',
  accent: '#ea5b0c',
  hoverBg: '#ea5b0c',
  selectedBg: '#ea5b0c',
  selectedText: '#ffffff',
};

export default function Sidebar({ logoHeight = 35, logoWidth, logoSrc, colors = defaultColors }) {
  const location = useLocation();
  const { user } = useAuth();
  const isCollaborateur = Array.isArray(user?.roles) && user.roles.some((r) => r.startsWith('ROLE_'));

  const itemsToShow = menuItems.filter((item) => !item.requiresCollaborateur || isCollaborateur);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 220,
          boxSizing: "border-box",
          background: (theme) => (colors?.background ?? theme.palette.background.paper),
          color: (theme) => (colors?.text ?? theme.palette.text.primary),
          borderRight: (theme) => `1px solid ${colors?.divider ?? theme.palette.divider}`,
          overflowX: 'hidden',
          height: '100vh',
          borderRadius: 0,
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 2, background: 'transparent', borderBottom: (theme) => `1px solid ${colors?.divider ?? theme.palette.divider}` }}>
        <Box
          component="img"
          src={logoSrc || defaultLogo}
          alt="Logo"
          sx={{ height: logoHeight, width: logoWidth || 'auto', objectFit: "contain", display: 'block' }}
        />
      </Box>
      <List sx={{ pr: 0 }}>
        {itemsToShow.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 0,
              mx: 1,
              my: 0.5,
              color: (theme) => (colors?.accent ?? theme.palette.primary.main),
              transition: 'background-color 0.2s ease, color 0.2s ease',
              "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                color: 'inherit',
              },
              "&.Mui-selected": {
                background: (theme) => (colors?.selectedBg ?? colors?.accent ?? theme.palette.primary.main),
                color: (theme) => (colors?.selectedText ?? theme.palette.primary.contrastText),
              },
              "&.Mui-selected .MuiListItemIcon-root, &.Mui-selected .MuiListItemText-primary": {
                color: (theme) => (colors?.selectedText ?? theme.palette.primary.contrastText),
              },
              "&:hover": {
                background: (theme) => (colors?.hoverBg ?? colors?.accent ?? theme.palette.primary.main),
                color: (theme) => (colors?.selectedText ?? theme.palette.primary.contrastText),
              },
              "&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-primary": {
                color: (theme) => (colors?.selectedText ?? theme.palette.primary.contrastText),
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}