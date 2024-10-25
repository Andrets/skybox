import React, { createContext } from "react";

interface ShortsListContextModel {
  activeSlideIndex: number;
  setActiveSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  slideIgnoreTouches: boolean;
  setSlideIgnoreTouches: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShortsListContext = createContext<ShortsListContextModel>(null!);

export default ShortsListContext;
