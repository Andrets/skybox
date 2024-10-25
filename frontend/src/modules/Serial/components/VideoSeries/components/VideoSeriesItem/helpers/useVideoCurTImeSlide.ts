import { useEffect, RefObject } from "react";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import {
  setVideoCurTime,
  setVideoLength,
} from "@/modules/Serial/slices/FilmVideoSlice";

export const useVideoCurTimeSlide = (
  isActive: boolean,
  videoRef: RefObject<HTMLVideoElement>
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isActive) {
        video.play();
        if (video.duration) {
          dispatch(setVideoLength(video.duration));
          dispatch(setVideoCurTime(0));
          video.currentTime = 0;
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  }, [isActive]);
};
