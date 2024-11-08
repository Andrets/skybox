
import { HTMLAttributes } from "react";
export interface ControlProps extends HTMLAttributes<HTMLDivElement> {
  onClickPlay?: React.MouseEventHandler<HTMLButtonElement>;
  isPlaying?: boolean;
}

export interface SerialControlProps extends ControlProps {
  episode: number;
}
