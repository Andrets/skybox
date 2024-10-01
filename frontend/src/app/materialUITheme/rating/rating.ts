import { Components } from "@mui/material";

export const ratingTheme: Components["MuiRating"] = {
  styleOverrides: {
    root: {
      "& .MuiRating-iconFilled": {
        color: "pink",
      },
    },
  },
};
