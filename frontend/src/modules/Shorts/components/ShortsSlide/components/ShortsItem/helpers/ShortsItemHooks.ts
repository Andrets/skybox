import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import { useEffect, useContext, useCallback, useRef } from "react";

export const useActivePlayingSwiper = (
  isActive: boolean,
  videoRef: React.RefObject<HTMLVideoElement>
) => {
  const { setViewPlay } = useContext(ShortsItemContext);
  useEffect(() => {
    const video = videoRef.current;
    try {
      if (video) {
        if (isActive) {
          video.play();
        } else {
          video.pause();
          setViewPlay(false);
          video.currentTime = 0;
        }
      }
    } catch (e) {}
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
    setVideoIsLoading,
  } = useContext(ShortsItemContext);

  const timerLoading = useRef<NodeJS.Timeout | null>(null);
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
  }, []);

  const onPauseVideo = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onClickVideo = (videoRef: React.RefObject<HTMLVideoElement>) => {
    const video = videoRef.current;

    if (video) {
      if (isPlaying) {
        video.pause();
        setViewPlay(true);
      } else {
        video.play();
        setViewPlay(false);
      }
    }
  };

  const onSliderChange = useCallback((value: number | number[]) => {
    /* eslint-disable */ // <-- Before function

    const video = videoRef.current;
    if (video && typeof value === "number") {
      video.currentTime = value;
      setCurTime(value);
    }

    /* eslint-enable */
  }, []);

  const onPlaying = () => {
    setVideoIsLoading(false);
    if (timerLoading.current) clearTimeout(timerLoading.current);
  };

  const onWaiting = () => {
    if (isPlaying) {
      timerLoading.current = setTimeout(() => {
        setVideoIsLoading(true);
        if (timerLoading.current) clearTimeout(timerLoading.current);
      }, 100);
    }
  };

  return {
    onVideoMetaDataLoad,
    onTimeUpdate,
    onPlayVideo,
    onPauseVideo,
    onClickVideo,
    onSliderChange,
    onPlaying,
    onWaiting,
  };
};
