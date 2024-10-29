import { ShortsItemModel } from "@/shared/models/ShortsApi";
import { HTMLAttributes } from "react";

export interface ShortsItemProps
  extends HTMLAttributes<HTMLVideoElement>,
    Omit<ShortsItemModel, "id" | "serail_id"> {
  isActive: boolean;
  autoPlay?: boolean;
  serial_id: ShortsItemModel["serail_id"];
  video: string;
  shorts_id: ShortsItemModel["id"];
  isLoadVideo: boolean;
}
