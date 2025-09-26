import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import DevicesIcon from "@mui/icons-material/Devices";
import WarningIcon from "@mui/icons-material/Warning";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation } from "react-router-dom";
import defaultLogo from "../assets/logo.jpg";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { text: "Tickets", icon: <ConfirmationNumberIcon />, path: "/tickets", requiredRoles: [] },
  { text: "Collaborateurs", icon: <PeopleIcon />, path: "/admin", requiredRoles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_COLLABORATEUR"] },
  { text: "Clients", icon: <DevicesIcon />, path: "/clients", requiredRoles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_COLLABORATEUR"] },
  { text: "Contacts", icon: <PeopleIcon />, path: "/contacts", requiredRoles: ["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_COLLABORATEUR"] },
  { text: "Mon profil", icon: <PersonIcon />, path: "/profile", requiredRoles: [] },
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

function hasAnyRole(userRoles = [], required = []) {
  if (!required || required.length === 0) return true;
  const set = new Set(userRoles);
  return required.some((r) => set.has(r));
}

export default function Sidebar({ logoHeight = 35, logoWidth, logoSrc, colors = defaultColors }) {
  const location = useLocation();
  const { user } = useAuth();
  const userRoles = Array.isArray(user?.roles) ? user.roles : [];

  const itemsToShow = menuItems.filter((item) => hasAnyRole(userRoles, item.requiredRoles));

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