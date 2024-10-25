import { Video } from "@/reusable-in-pages/components/Video";
import videoFILE from "@/shared/assets/videos/video.mp4";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { useRef } from "react";
import styles from "./styles.module.scss";
import { VideoSeriesItemModel } from "../models/VideoSeriesItemModel";
import { Control } from "./components/Control";
import { useVideoSeriesClick } from "../../../../helpers/useVideoSeriesClick";
import { useVideoCurTimeSlide } from "./helpers/useVideoCurTImeSlide";
import { useChangeVideoCurTime } from "./helpers/useChangeVideoCurTIme";
import { useVideoFunctions } from "./helpers/useVideoFunctions";

export const VideoSeriesItem = ({ isActive = false }: VideoSeriesItemModel) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const isPlay = useAppSelector((state) => state.filmVideo.isPlayVideo);
  if (isActive) {
    console.log( videoRef, isPlay);
  }

  useVideoCurTimeSlide(isActive, videoRef);
  useChangeVideoCurTime(videoRef);
  const { onClick } = useVideoSeriesClick();
  const {
    handleEndedVideo,
    onClickPlay,
    onPlay,
    onPause,
    onTimeUpdate,
    onLoadedMetadata,
  } = useVideoFunctions(isActive, videoRef);

  const isViewController = useAppSelector(
    (state) => state.filmVideo.isViewControlVideo
  );

  return (
    <Video
      onEnded={handleEndedVideo}
      className={styles.video}
      onPlay={onPlay}
      onPause={onPause}
      videoRef={videoRef}
      src={videoFILE}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onClick={onClick}
    >
      {isViewController && (
        <Control
          onClick={onClick}
          isPlaying={isPlay}
          onClickPlay={onClickPlay}
        />
      )}
    </Video>
  );
};
