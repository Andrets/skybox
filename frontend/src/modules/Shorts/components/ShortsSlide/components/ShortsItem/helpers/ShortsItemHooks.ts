import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import { useEffect, useContext, useCallback } from "react";

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
    } catch (e) {
      console.log(e);
    }
  }, [isActive]);
};

export const useUserIsView = (isActive: boolean, serial_id: number) => {
  console.log(serial_id);
  const { userIsView, setUserIsView } = useContext(ShortsItemContext);

  useEffect(() => {
    if (isActive && userIsView) {
      setUserIsView(true);
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
  }, []);

  const onPauseVideo = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onClickVideo = useCallback(
    (videoRef: React.RefObject<HTMLVideoElement>) => {
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
