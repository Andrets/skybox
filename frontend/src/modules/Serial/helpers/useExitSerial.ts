import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import { resetState } from "../slices/FilmVideoSlice";
import { filmInfoApiSlice } from "@/api/FilmInfoApi";
import { useEffect } from "react";

export const useExitSerial = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetState());
      dispatch(filmInfoApiSlice.util.invalidateTags(["Likes", "Language"]));
    };
  }, []);
};
