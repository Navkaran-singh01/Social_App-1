import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import "./index.css";
import {BrowserRouter} from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0066FF', // green
    },
    background: {
      default: '#ffffff', // white background
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<BrowserRouter>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    </ThemeProvider>
</BrowserRouter>
);
