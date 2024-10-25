import { Components } from "@mui/material";

export const buttonTheme: Components["MuiButton"] = {
  styleOverrides: {
    root: {
      textTransform: "inherit",
      color: "var(--main-text-color)",
      maxWidth: undefined,
      maxHeight: undefined,
      minHeight: 0,
      minWidth: 0,
    },
  },
};
