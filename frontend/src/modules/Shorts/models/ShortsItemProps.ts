import { ShortsItemModel } from "@/shared/models/ShortsApi";
import { HTMLAttributes } from "react";

export interface ShortsItemProps extends HTMLAttributes<HTMLVideoElement> {
  isActive: boolean;
  autoPlay?: boolean;
  video: string;
  series_id: ShortsItemModel["id"];
  isLoadVideo: boolean;
}
