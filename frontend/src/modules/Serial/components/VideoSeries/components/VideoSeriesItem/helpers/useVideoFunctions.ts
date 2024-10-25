import { SerialContext } from "@/reusable-in-pages/contexts/SerialContext/context";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import {
  useContext,
  RefObject,
  ReactEventHandler,
  useCallback,
  SyntheticEvent,
  MouseEventHandler,
} from "react";
import {
  setVideoCurTime,
  setVideoLength,
  togglePlayVideo,
  toggleViewControlVideo,
} from "@/modules/Serial/slices/FilmVideoSlice";

export const useVideoFunctions = (
  isActive: boolean,
  videoRef: RefObject<HTMLVideoElement>
) => {
  const { swiperRef, viewTimerRef } = useContext(SerialContext);
  const dispatch = useAppDispatch();
  const isPlay = useAppSelector((state) => state.filmVideo.isPlayVideo);

  const handleEndedVideo: ReactEventHandler<HTMLVideoElement> =
    useCallback(() => {
      if (isActive && swiperRef.current) {
        swiperRef.current.slideNext(0);
      }
    }, [isActive]);

  const onClickPlay = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      e.stopPropagation();
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
      }
      dispatch(toggleViewControlVideo(true));
      if (videoRef.current) {
        if (!isPlay) {
          videoRef.current.play();
          viewTimerRef.current = setTimeout(() => {
            dispatch(toggleViewControlVideo(false));
          }, 2500);
        } else {
          videoRef.current.pause();
        }
      }
    },
    [isPlay]
  );

  const onPlay = useCallback(() => {
    if (isActive) {
      dispatch(togglePlayVideo(true));
    }
  }, [isActive]);
  const onPause = useCallback(() => {
    if (isActive) {
      dispatch(togglePlayVideo(false));
    }
  }, [isActive]);

  const onTimeUpdate = useCallback(
    (e: SyntheticEvent<HTMLVideoElement, Event>) => {
      dispatch(setVideoCurTime(e.currentTarget.currentTime));
    },
    []
  );

  const onLoadedMetadata = useCallback(
    (e: SyntheticEvent<HTMLVideoElement, Event>) => {
      if (isActive) {
        dispatch(setVideoLength(e.currentTarget.duration));
      }
    },
    []
  );

  return {
    handleEndedVideo,
    onClickPlay,
    onPlay,
    onPause,
    onTimeUpdate,
    onLoadedMetadata,
  };
};
