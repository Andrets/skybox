import { LinkProps } from "react-router-dom";

export interface WatchHistoryItemProps extends LinkProps {
  poster: string;
  name: React.ReactNode;
}
