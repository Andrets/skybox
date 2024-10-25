import { useRef } from "react";
import { SerialContext } from "./context";
import { Swiper as SwiperType } from "swiper";

export interface SerialContextProviderModel {
  children: React.ReactNode;
}
export function SerialContextProvider({
  children,
}: SerialContextProviderModel) {
  const viewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <SerialContext.Provider value={{ viewTimerRef: viewTimerRef, swiperRef }}>
      {children}
    </SerialContext.Provider>
  );
}
