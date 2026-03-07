import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createTheme, responsiveFontSizes, ThemeProvider} from "@mui/material";
import {App} from "./App.tsx";

let lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#6B7280',
        },
        primary: {
            main: '#3B82F6', // Slate Blue
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#2563EB', // Royal Blue (for hovers or accents)
        },
        divider: '#E5E7EB',
    },
    typography: {
        fontFamily: 'Inter, Roboto, sans-serif',
    },
});

lightTheme = responsiveFontSizes(lightTheme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
        <App />
    </ThemeProvider>
  </StrictMode>,
)
