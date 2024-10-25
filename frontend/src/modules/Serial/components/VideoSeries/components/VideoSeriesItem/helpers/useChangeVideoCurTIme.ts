import { useEffect, RefObject } from "react";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import { setVideoCurTime } from "@/modules/Serial/slices/FilmVideoSlice";

export const useChangeVideoCurTime = (
  videoRef: RefObject<HTMLVideoElement>
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    function changeFunc(e: CustomEvent) {
      if (videoRef.current && e?.detail?.value) {
        dispatch(setVideoCurTime(e.detail.value));
        videoRef.current.currentTime = e.detail.value;
      }
    }
    window.addEventListener("sliderUserChangeEvent", changeFunc);

    return () =>
      window.removeEventListener("sliderUserChangeEvent", changeFunc);
  }, []);
};
