import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    background: {
      default: "#ecf6fa",
    },
    primary: { main: "#1582da", light: "#2892e6" },
    secondary: {
      main: "#ecf6fa",
    },
  },
  typography: {
    fontFamily: ["Golos Text", "sans-serif"].join(","),
  },
});
export default theme;
