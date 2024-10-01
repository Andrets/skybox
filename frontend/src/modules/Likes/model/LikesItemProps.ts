import { LinkProps } from "react-router-dom";

export interface LikesItemProps extends LinkProps {
  name?: string;
  poster: string;
}
