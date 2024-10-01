import { useRef, useState } from "react";
import { ShortsItemContext } from "./context";

interface ShortsItemProviderProps {
  children?: React.ReactNode;
}

export const ShortsItemProvider = ({ children }: ShortsItemProviderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLength, setVideoLength] = useState(0);
  const [curTime, setCurTime] = useState(0);
  const [viewPlay, setViewPlay] = useState(false);
  const [isChangingTime, setIsChangingTime] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <ShortsItemContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        videoLength,
        setVideoLength,
        curTime,
        setCurTime,
        viewPlay,
        setViewPlay,
        videoRef,
        isChangingTime,
        setIsChangingTime,
      }}
    >
      {children}
    </ShortsItemContext.Provider>
  );
};
