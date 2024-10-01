import { Components } from "@mui/material";

export const buttonTheme: Components["MuiButton"] = {
  styleOverrides: {
    root: {
      textTransform: "capitalize",
      color: "var(--main-text-color)",
    },
  },
};
