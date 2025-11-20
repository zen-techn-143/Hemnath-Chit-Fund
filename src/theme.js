// theme.js
import { createTheme } from "@mui/material/styles";

const baseTypography = {
  fontFamily: '"Poppins", "Noto Sans Tamil", sans-serif',
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
};

const baseComponents = {
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper, 
      }),
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper, 
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 500,
        ...baseTypography,
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        ...baseTypography,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      label: {
        fontWeight: 600,
        ...baseTypography,
      },
    },
  },
};

// ---------------------------
// 1. THEME A (Default - Blue)
// ---------------------------
export const themeA = createTheme({
    palette: { 
        mode: 'light', 
        primary: { main: '#3f51b5' }, // Default Blue
    },
    components: baseComponents,
    typography: baseTypography,
});

// ---------------------------
// 2. THEME B (Dark)
// ---------------------------
export const themeB = createTheme({
    palette: { 
        mode: 'light', 
        primary: { main: '#90caf9' }, // Lighter blue for dark mode primary
        background: { 
            default: '#ffffffff', 
            paper: '#ffe7e7ff',    
        }
    },
    components: baseComponents,
    typography: baseTypography,
});

// ---------------------------
// 3. THEME C (Indigo)
// ---------------------------
export const themeC = createTheme({
    palette: { 
        mode: 'light',
        primary: { main: '#303f9f' }, // Indigo
    },
    components: baseComponents,
    typography: baseTypography,
});

// ---------------------------
// 4. THEME D (Teal)
// ---------------------------
export const themeD = createTheme({
    palette: { 
        mode: 'light',
        primary: { main: '#2E7D32' }, // Emerald Green
        background: { 
            default: '#ffffffff', 
            paper: '#ffe7e7ff',    
        }
    },
    components: baseComponents,
    typography: baseTypography,
});

// ✅ Theme Map for dynamic lookup in App.js
export const themeMap = {
    A: themeA,
    B: themeB,
    C: themeC,
    D: themeD
};