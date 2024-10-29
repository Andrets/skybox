import { useEffect, useState } from "react";

export const useVideoSrc = (isLoadVideo: boolean, source: string) => {
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (videoSrc === undefined && isLoadVideo) {
      setVideoSrc(source);
    }
  }, [isLoadVideo]);

  return videoSrc;
};
