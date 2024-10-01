import { Components } from "@mui/material";

export const skeletonTheme: Components["MuiSkeleton"] = {
  styleOverrides: {
    root: {
      transform: "scale(1)",
      background: "var(--skeleton-bg)",
    },
  },
};
