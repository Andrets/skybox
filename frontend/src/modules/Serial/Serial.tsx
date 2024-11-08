import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
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
import { setIsCommentsModalOpen, setOpenRating } from "./slices/FilmVideoSlice";
import { RateModal } from "./ui";
import { CommentsModal } from "./ui/CommentsModal/CommentsModal";
import { useExitSerial } from "./helpers/useExitSerial";

const Serial = () => {
  useBlockScroll();
  useAddHistory();
  useBackButton();
  useExitSerial();

  const dispatch = useAppDispatch();
  const isViewSlider = useAppSelector(
    (state) => state.filmVideo.isViewControlVideo
  );
  const isBlockSlide = useAppSelector(
    (state) => state.filmVideo.isBlockedSlide
  );
  const isOpenRating = useAppSelector((state) => state.filmVideo.isOpenRating);
  const isCommentsOpenModal = useAppSelector(
    (state) => state.filmVideo.isCommentsModalOpen
  );
  const { onTouchStart, onTouchEnd } = useVideoSeriesClick();
  const { id } = useParams();
  const { data: filmSeriesData, isLoading: filmSeriesLoading } =
    useGetAllSeriesQuery(id ? id : "", {
      skip: id === undefined ? true : false,
    });

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

        <RateModal
          open={isOpenRating}
          onClose={() => {
            dispatch(setOpenRating(false));
          }}
        />

        <CommentsModal
          open={isCommentsOpenModal}
          onClose={() => {
            dispatch(setIsCommentsModalOpen(false));
          }}
          onCloseClickBtn={() => {
            dispatch(setIsCommentsModalOpen(false));
          }}
        />
      </>
    );
  }
};

export default Serial;
