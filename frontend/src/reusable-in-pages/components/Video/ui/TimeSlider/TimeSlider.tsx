import { Slider, SliderProps, createTheme } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import styles from "./styles.module.scss";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "rgba(251, 138, 0)",
    },
  },
});

export const TimeSlider = styled((props: SliderProps) => (
  <ThemeProvider theme={customTheme}>
    <Slider
      {...props}
      className={`${styles.slider} ${props.className}`}
      slotProps={{
        thumb: { className: "thumb" },
        rail: { className: "rail" },
        track: { className: "track" },
      }}
    />
  </ThemeProvider>
))`
  color: var(--main-theme-color-2);

  & .thumb {
    border-radius: 50%;
    width: 10px;
    height: 10px;
    background-color: var(--main-theme-color-2);
  }

  & .thumb:hover {
    border-radius: 50%;
  }

  & .rail {
    background: rgba(61, 59, 60, 1);
  }

  & .track {
    background-color: var(--main-theme-color-2);
    border: 0;
    outline: 0;
  }
`;
