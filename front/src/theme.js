import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ea5b0c", //orange
      contrastText: "#ffffff", //blanc
    },
    secondary: {
      main: "#919293", //gris
      contrastText: "#ffffff", //blanc
    },
    background: {
      default: "#f7f7f7", //gris clair
      paper: "#ffffff",
    },
    text: {
      primary: "#313635", //gris foncé
      secondary: "#919293",
    },
    divider: "#e0e0e0", //gris
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme; 