import { useRef, useState } from "react";
import { VideoSeriesItemContext } from "./context";

interface VideoSeriesItemProviderProps {
  children?: React.ReactNode;
}

export const VideoSeriesItemProvider = ({
  children,
}: VideoSeriesItemProviderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoIsLoading, setVideoIsLoading] = useState(false);

  return (
    <VideoSeriesItemContext.Provider
      value={{ videoRef, videoIsLoading, setVideoIsLoading }}
    >
      {children}
    </VideoSeriesItemContext.Provider>
  );
};
