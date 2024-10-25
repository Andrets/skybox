import { createTheme } from "@mui/material/styles";
import { skeletonTheme } from "./skeleton/skeletonTheme";
import { buttonTheme } from "./button/buttonTheme";
import { ratingTheme } from "./rating/rating";
import { textareaTheme } from "./textarea/textarea";
export const theme = createTheme({
  components: {
    MuiSkeleton: skeletonTheme,
    MuiButton: buttonTheme,
    MuiRating: ratingTheme,
    MuiTextField: textareaTheme,
    MuiModal: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        },
        backdrop: {
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          transition: "1s linear",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(51, 51, 51, 1)",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          padding: 16,
        },
      },
    },
  },
});
