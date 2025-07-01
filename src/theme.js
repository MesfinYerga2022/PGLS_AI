import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "light") => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#2e77ac",
        light: "#5a8bc4",
        dark: "#1d5378",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#f47920",
        light: "#f69851",
        dark: "#c85e16",
        contrastText: "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
        fontSize: "2.5rem",
      },
      h2: {
        fontWeight: 600,
        fontSize: "2rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.75rem",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.25rem",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1rem",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  });
};
