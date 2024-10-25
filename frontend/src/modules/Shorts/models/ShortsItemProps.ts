import { ShortsItemModel } from "@/shared/models/ShortsApi";
import { HTMLAttributes } from "react";

export interface ShortsItemProps
  extends HTMLAttributes<HTMLVideoElement>,
    Omit<ShortsItemModel, "id"> {
  isActive: boolean;
  autoPlay?: boolean;
  serial_id: ShortsItemModel["id"];
  video: string;
}
