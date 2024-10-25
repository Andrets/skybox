import { useAppSelector } from "@/shared/hooks/reduxTypes";
import ListEpisodes from "./components/ListEpisodes";
import { VideoTimeSlider } from "./components/TimeSlider/VideoTimeSlider";
import { VideoSeries } from "./components/VideoSeries/VideoSeries";
import useBlockScroll from "@/shared/hooks/useBlockScroll";
import { useVideoSeriesClick } from "./helpers/useVideoSeriesClick";
const Serial = () => {
  useBlockScroll(true);
  const isViewSlider = useAppSelector(
    (state) => state.filmVideo.isViewControlVideo
  );
  const { onTouchStart, onTouchEnd } = useVideoSeriesClick();
  return (
    <>
      <VideoSeries />
      {isViewSlider && (
        <VideoTimeSlider onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} />
      )}
      <ListEpisodes />
    </>
  );
};

export default Serial;
