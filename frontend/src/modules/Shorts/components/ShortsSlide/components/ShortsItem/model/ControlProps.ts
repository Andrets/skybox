import { HTMLAttributes } from "react";

export interface ControlProps extends HTMLAttributes<HTMLElement> {
  isViewTimeSlider: boolean;
  episode: number;
  name: string;
  likes: number;
  is_liked: boolean;
  shorts_id: number;
  serail_id: number;
}

export interface SideButtonsProps
  extends Pick<ControlProps, "is_liked" | "likes"> {
  id: number;
  serail_id: number;
}
