import { Video } from "@/reusable-in-pages/components/Video";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { useContext } from "react";
import styles from "./styles.module.scss";
import { VideoSeriesItemModel } from "../models/VideoSeriesItemModel";
import { Control } from "./components/Control";
import { useVideoSeriesClick } from "../../../../helpers/useVideoSeriesClick";
import { useVideoCurTimeSlide } from "./helpers/useVideoCurTImeSlide";
import { useChangeVideoCurTime } from "./helpers/useChangeVideoCurTIme";
import { useVideoFunctions } from "./helpers/useVideoFunctions";
import { VideoSeriesItemContext } from "@/reusable-in-pages/contexts/VideoSeriesItemContext/context";
import { LoaderSpinner } from "@/ui/Icons";
import { BlockSlide } from "./components";
import { useCurrentVideoLength } from "./helpers/useCurrentVideoLength";
import { useParams } from "react-router-dom";
import { useGetFilmInfoQuery } from "@/api/FilmInfoApi";

export const VideoSeriesItem = ({
  isActive = false,
  episode,
  isAvailable,
  ...restProps
}: VideoSeriesItemModel) => {
  const isPlay = useAppSelector((state) => state.filmVideo.isPlayVideo);
  const isViewController = useAppSelector(
    (state) => state.filmVideo.isViewControlVideo
  );

  const { videoRef, videoIsLoading } = useContext(VideoSeriesItemContext);

  const { id } = useParams();
  const { data: filmInfoData } = useGetFilmInfoQuery(id ? id : "", {
    skip: id ? false : true,
  });
  const {
    handleEndedVideo,
    onClickPlay,
    onPlay,
    onPause,
    onTimeUpdate,
    onLoadedMetadata,
    onPlaying,
    onWaiting,
  } = useVideoFunctions(isActive, videoRef);

  useVideoCurTimeSlide(isActive, videoRef);
  useChangeVideoCurTime(videoRef, isActive);
  useCurrentVideoLength(isActive, videoRef);

  const { onClick } = useVideoSeriesClick();

  if (!isAvailable) {
    return (
      <>
        {isActive && (
          <BlockSlide
            likes={filmInfoData?.likes ? String(filmInfoData?.likes) : ""}
            isLiked={filmInfoData?.user_has_liked ? true : false}
          />
        )}
      </>
    );
  }

  return (
    <Video
      {...restProps}
      onEnded={handleEndedVideo}
      className={styles.video}
      onPlay={onPlay}
      onPause={onPause}
      videoRef={videoRef}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onClickContainer={onClick}
      onPlaying={onPlaying}
      onWaiting={onWaiting}
    >
      <>
        {isViewController && (
          <Control
            onClick={onClick}
            isPlaying={isPlay}
            onClickPlay={onClickPlay}
            episode={episode}
          />
        )}

        {videoIsLoading && <LoaderSpinner className={styles.loaderSpinner} />}
      </>
    </Video>
  );
};
