import { SliderProps } from "@mui/material";
import { HTMLAttributes } from "react";
export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
  onClickPlay?: React.MouseEventHandler<HTMLButtonElement>;
  onSliderChange?: SliderProps["onChange"];
}
