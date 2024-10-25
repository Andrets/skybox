import { HTMLAttributes } from "react";

export interface VideoSeriesItemModel extends HTMLAttributes<HTMLVideoElement> {
  isActive?: boolean;
}
