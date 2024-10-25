import { MutableRefObject, createContext } from "react";
import { Swiper as SwiperType } from "swiper";

export interface SerialContextModel {
  viewTimerRef: MutableRefObject<NodeJS.Timeout | null>;
  swiperRef: MutableRefObject<SwiperType | null>;
}

export const SerialContext = createContext<SerialContextModel>(null!);
