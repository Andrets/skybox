import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import { useEffect, useContext, useCallback } from "react";

export const useActivePlayingSwiper = (
  isActive: boolean,
  videoRef: React.RefObject<HTMLVideoElement>
) => {
  useEffect(() => {
    const video = videoRef.current;
    try {
      if (video) {
        if (isActive) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    } catch {
      console.log("error");
    }
  }, [isActive]);
};

export const useUpdateVideoMetaInfo = () => {
  const {
    setVideoLength,
    setCurTime,
    setIsPlaying,
    isPlaying,
    setViewPlay,
    videoRef,
  } = useContext(ShortsItemContext);
  const onVideoMetaDataLoad = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setVideoLength(e.currentTarget.duration);
    },
    []
  );

  const onTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
      setCurTime(e.currentTarget.currentTime);
    },
    []
  );

  const onPlayVideo = useCallback(() => {
    setIsPlaying(true);
    setViewPlay(false);
  }, []);

  const onPauseVideo = useCallback(() => {
    setIsPlaying(false);
    setViewPlay(true);
  }, []);

  const onClickVideo = useCallback(
    (videoRef: React.RefObject<HTMLVideoElement>) => {
      const video = videoRef.current;

      if (video) {
        if (isPlaying) {
          video.pause();
        } else {
          video.play();
        }
      }
    },
    [isPlaying]
  );

  const onSliderChange = useCallback((value: number | number[]) => {
    /* eslint-disable */ // <-- Before function

    const video = videoRef.current;
    if (video && typeof value === "number") {
      video.currentTime = value;
      setCurTime(value);
    }

    /* eslint-enable */
  }, []);

  return {
    onVideoMetaDataLoad,
    onTimeUpdate,
    onPlayVideo,
    onPauseVideo,
    onClickVideo,
    onSliderChange,
  };
};
