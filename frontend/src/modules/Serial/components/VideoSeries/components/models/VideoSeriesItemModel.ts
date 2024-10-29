import { VideoInterfaceProps } from "@/reusable-in-pages/components/Video/interface";

export interface VideoSeriesItemModel extends VideoInterfaceProps {
  isActive?: boolean;
  episode: number;
  isAvailable: boolean;
}
