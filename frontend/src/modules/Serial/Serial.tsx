import { useAppSelector } from "@/shared/hooks/reduxTypes";
import ListEpisodes from "./components/ListEpisodes";
import { VideoTimeSlider } from "./components/TimeSlider/VideoTimeSlider";
import { VideoSeries } from "./components/VideoSeries/VideoSeries";
import useBlockScroll from "@/shared/hooks/useBlockScroll";
import { useVideoSeriesClick } from "./helpers/useVideoSeriesClick";
import { useGetAllSeriesQuery } from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";
import { useAddHistory } from "./helpers/useAddHistory";
import { LoaderSpinner } from "@/ui/Icons";
import styles from "./styles.module.scss";
import useBackButton from "@/shared/hooks/useBackButton";

const Serial = () => {
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

  useBlockScroll(true);
  useAddHistory();
  useBackButton();

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
          <VideoTimeSlider onMouseDown={onTouchStart} onMouseUp={onTouchEnd} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />
        )}
        <ListEpisodes episodes={filmSeriesData} />
      </>
    );
  }
};

export default Serial;
