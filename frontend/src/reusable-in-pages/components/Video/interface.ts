import { HTMLAttributes, MediaHTMLAttributes } from "react";

export interface VideoInterfaceProps
  extends HTMLAttributes<HTMLVideoElement>,
    MediaHTMLAttributes<HTMLVideoElement>,
    React.RefAttributes<HTMLVideoElement> {
  videoRef?: React.RefObject<HTMLVideoElement>;
}
