import { SerialContext } from "@/reusable-in-pages/contexts/SerialContext/context";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import {
  useContext,
  RefObject,
  ReactEventHandler,
  useCallback,
  SyntheticEvent,
  MouseEventHandler,
  useRef,

} from "react";
import {
  setVideoCurTime,
  setVideoLength,
  togglePlayVideo,
  toggleViewControlVideo,
} from "@/modules/Serial/slices/FilmVideoSlice";
import { VideoSeriesItemContext } from "@/reusable-in-pages/contexts/VideoSeriesItemContext/context";

export const useVideoFunctions = (
  isActive: boolean,
  videoRef: RefObject<HTMLVideoElement>
) => {
  const { swiperRef, viewTimerRef } = useContext(SerialContext);
  const { setVideoIsLoading } = useContext(VideoSeriesItemContext);
  const dispatch = useAppDispatch();
  const isPlay = useAppSelector((state) => state.filmVideo.isPlayVideo);
  const timerLoading = useRef<NodeJS.Timeout | null>(null);



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
    [isActive]
  );

  const onPlaying = () => {
    setVideoIsLoading(false);
    if (timerLoading.current) clearTimeout(timerLoading.current);
  };

  const onWaiting = () => {
    if (isPlay) {
      timerLoading.current = setTimeout(() => {
        setVideoIsLoading(true);
        if (timerLoading.current) clearTimeout(timerLoading.current);
      }, 500);
    }
  };

  return {
    handleEndedVideo,
    onClickPlay,
    onPlay,
    onPause,
    onTimeUpdate,
    onLoadedMetadata,
    onPlaying,
    onWaiting,
  };
};
