import { setVideoLength } from "@/modules/Serial/slices/FilmVideoSlice";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import { RefObject, useEffect } from "react";

export const useCurrentVideoLength = (
  isActive: boolean,
  videoRef: RefObject<HTMLVideoElement>
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isActive && videoRef.current?.duration)
      dispatch(setVideoLength(videoRef.current?.duration));
  }, [isActive]);
};
