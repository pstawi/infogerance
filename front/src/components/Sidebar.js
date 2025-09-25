import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import DevicesIcon from "@mui/icons-material/Devices";
import WarningIcon from "@mui/icons-material/Warning";
import { Link, useLocation } from "react-router-dom";
import defaultLogo from "../assets/logo.jpg";

const menuItems = [
  { text: "Tickets", icon: <ConfirmationNumberIcon />, path: "/tickets" },
  { text: "Collaborateurs", icon: <PeopleIcon />, path: "/admin" },
  { text: "Clients", icon: <DevicesIcon />, path: "/clients" },
  { text: "Contacts", icon: <PeopleIcon />, path: "/contacts" },
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 2, background: '#ffffff', borderBottom: (theme) => `1px solid ${colors?.divider ?? theme.palette.divider}` }}>
        <Box
          component="img"
          src={logoSrc || defaultLogo}
          alt="Logo"
          sx={{ height: logoHeight, width: logoWidth || 'auto', objectFit: "contain", display: 'block' }}
        />
      </Box>
      <List sx={{ pr: 0 }}>
        {menuItems.map((item) => (
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