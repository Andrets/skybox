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
  },
});
