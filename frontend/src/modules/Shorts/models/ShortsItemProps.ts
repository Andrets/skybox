import { HTMLAttributes } from "react";

export interface ShortsItemProps extends HTMLAttributes<HTMLVideoElement> {
  isActive: boolean;
  autoPlay?: boolean;
  ignoreTouches: boolean;
}
