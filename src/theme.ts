import {createTheme} from "@mui/material";

declare module "@mui/material/styles/createPalette" {
    export interface TypeBackground {
        defaultGradient: string;
    }
}

const theme = createTheme({
    palette: {
        text: {
            primary: '#3b3b3b'
        },
        background: {
            default: "#ecf6fa",
            defaultGradient: "linear-gradient(to top, #d8e9f7, #e5edf4)"
        },
        primary: {main: "#1582da", light: "#2892e6"},
        secondary: {
            main: "#ecf6fa",
        },
    },
    typography: {
        fontFamily: ["Golos Text", "sans-serif"].join(","),
    },
});
export default theme;
