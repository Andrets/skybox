import React, { createContext } from "react";

export interface VideoSeriesItemContextModel {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoIsLoading: boolean;
  setVideoIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const VideoSeriesItemContext =
  createContext<VideoSeriesItemContextModel>(null!);
