import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import ListEpisodes from "./components/ListEpisodes";
import { VideoTimeSlider } from "./components/TimeSlider/VideoTimeSlider";
import { VideoSeries } from "./components/VideoSeries/VideoSeries";
import useBlockScroll from "@/shared/hooks/useBlockScroll";
import { useVideoSeriesClick } from "./helpers/useVideoSeriesClick";
import { filmInfoApiSlice, useGetAllSeriesQuery } from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";
import { useAddHistory } from "./helpers/useAddHistory";
import { LoaderSpinner } from "@/ui/Icons";
import styles from "./styles.module.scss";
import useBackButton from "@/shared/hooks/useBackButton";
import { useEffect } from "react";
import { resetState } from "./slices/FilmVideoSlice";

const Serial = () => {
  const dispatch = useAppDispatch();
  const isViewSlider = useAppSelector(
    (state) => state.filmVideo.isViewControlVideo
  );
  const isBlockSlide = useAppSelector(
    (state) => state.filmVideo.isBlockedSlide
  );
  const { onTouchStart, onTouchEnd } = useVideoSeriesClick();
  const { id } = useParams();
  const { data: filmSeriesData, isLoading: filmSeriesLoading } =
    useGetAllSeriesQuery(id ? id : "", {
      skip: id === undefined ? true : false,
    });

  useBlockScroll();
  useAddHistory();
  useBackButton();

  useEffect(() => {
    dispatch(resetState());
  }, []);

  useEffect(() => {
    return () => {
      dispatch(filmInfoApiSlice.util.invalidateTags(["Likes", "Language"]));
    };
  }, []);

  if (filmSeriesLoading) {
    return (
      <>
        <LoaderSpinner className={styles.loader} />
      </>
    );
  }

  if (filmSeriesData) {
    return (
      <>
        <VideoSeries series={filmSeriesData} />
        {isViewSlider && !isBlockSlide && (
          <VideoTimeSlider
            onMouseDown={onTouchStart}
            onMouseUp={onTouchEnd}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        )}
        <ListEpisodes episodes={filmSeriesData} />
      </>
    );
  }
};

export default Serial;
