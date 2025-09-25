import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleIcon from "@mui/icons-material/People";
import DevicesIcon from "@mui/icons-material/Devices";
import WarningIcon from "@mui/icons-material/Warning";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { text: "Tickets", icon: <ConfirmationNumberIcon />, path: "/tickets" },
  { text: "Collaborateurs", icon: <PeopleIcon />, path: "/admin" },
  { text: "Clients", icon: <DevicesIcon />, path: "/clients" },
  { text: "Contacts", icon: <PeopleIcon />, path: "/contacts" },
];

export default function Sidebar() {
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
          background: (theme) => theme.palette.background.paper,
          color: (theme) => theme.palette.text.primary,
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              "&.Mui-selected": {
                background: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.primary.contrastText,
              },
              "&:hover": {
                background: (theme) => theme.palette.action.hover,
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