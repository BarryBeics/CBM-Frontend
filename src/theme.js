import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens
export const tokens = (mode) => {
  const shared = {
    houndGold: {
      100: "#f2e9d8",
      200: "#e5d3b1",
      300: "#d8be8b",
      400: "#cba864",
      500: "#be923d",
      600: "#987531",
      700: "#725825",
      800: "#4c3a18",
      900: "#261d0c",
    },
    scalpelTeal: {
      100: "#d1e6e5",
      200: "#a2cdcc",
      300: "#74b4b2",
      400: "#459b99",
      500: "#17827f",
      600: "#126866",
      700: "#0e4e4c",
      800: "#093433",
      900: "#051a19",
    },
    grey: {
      100: "#f9f9f9",
      200: "#e0e0e0",
      300: "#c2c2c2",
      400: "#a3a3a3",
      500: "#858585",
      600: "#666666",
      700: "#4d4d4d",
      800: "#333333",
      900: "#1a1a1a",
    },
    softRed: {
      100: "#fbeaea",
      200: "#f5c5c5",
      300: "#ef9f9f",
      400: "#e97a7a",
      500: "#e35454",  // primary red
      600: "#b34646",
      700: "#843838",
      800: "#542929",
      900: "#251b1b"
    },
    

  };

  const light = {
    background: {
      default: shared.grey[200],
      paper: "#ffffff",
    },
    text: {
      primary: shared.grey[900],
      secondary: shared.grey[600],
    },
  };

  const dark = {
    background: {
      default: shared.grey[900],
      paper: shared.grey[800],
    },
    text: {
      primary: shared.grey[100],
      secondary: shared.grey[300],
    },
  };

  return {
    ...shared,
    ...(mode === "dark" ? dark : light),
  };
};

// MUI theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode,
      primary: {
        main: colors.scalpelTeal[500],
      },
      secondary: {
        main: colors.houndGold[500],
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
      error: {
        main: colors.softRed[500],
        light: colors.softRed[300],
        dark: colors.softRed[700],
      },
    },
    typography: {
      fontFamily: ["Source Sans 3", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontSize: 40,
        fontWeight: 700,
        color: colors.text.primary,
      },
      h2: {
        fontSize: 32,
        fontWeight: 600,
        color: colors.text.primary,
      },
      h3: {
        fontSize: 24,
        fontWeight: 600,
        color: colors.text.primary,
      },
      h4: {
        fontSize: 20,
        fontWeight: 600,
        color: colors.text.primary,
      },
      h5: {
        fontSize: 16,
        fontWeight: 500,
        color: colors.text.secondary,
      },
      h6: {
        fontSize: 14,
        fontWeight: 500,
        color: colors.text.secondary,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
