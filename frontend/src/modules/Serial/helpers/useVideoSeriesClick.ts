import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";

import { useContext } from "react";
import { SerialContext } from "@/reusable-in-pages/contexts/SerialContext/context";
import { toggleViewControlVideo } from "@/modules/Serial/slices/FilmVideoSlice";

export const useVideoSeriesClick = () => {
  const videoIsPlay = useAppSelector((state) => state.filmVideo.isPlayVideo);
  const isViewVideoController = useAppSelector(
    (state) => state.filmVideo.isViewControlVideo
  );
  const dispatch = useAppDispatch();
  const { viewTimerRef } = useContext(SerialContext);

  const onClick = () => {
    if (videoIsPlay) {
    
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
      }
      dispatch(toggleViewControlVideo(!isViewVideoController));
      viewTimerRef.current = setTimeout(() => {
        if (viewTimerRef.current) {
          console.log("blyaaaa");
          dispatch(toggleViewControlVideo(false));
          clearTimeout(viewTimerRef.current);
        }
      }, 2500);
    } else {
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
      }
      dispatch(toggleViewControlVideo(true));
    }
  };

  const onTouchStart = () => {
    console.log("blyaegrwefdw");
    if (videoIsPlay) {
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
      }
      dispatch(toggleViewControlVideo(true));
    }
  };

  const onTouchEnd = () => {
    if (videoIsPlay) {
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current);
      }

      viewTimerRef.current = setTimeout(() => {
        dispatch(toggleViewControlVideo(true));
        if (viewTimerRef.current) {
          dispatch(toggleViewControlVideo(false));
          clearTimeout(viewTimerRef.current);
        }
      }, 2500);
    }
  };

  return { onTouchStart, onTouchEnd, onClick };
};
