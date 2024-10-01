import { Video } from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";
import shortsFile from "@/shared/assets/videos/video.mp4";
import { Control } from "./ui/Control";
import { ShortsItemProps } from "../../models/ShortsItemProps";
import {
  useActivePlayingSwiper,
  useUpdateVideoMetaInfo,
} from "./helpers/ShortsItemHooks";
import { useContext } from "react";
import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";

export const ShortsItem = ({
  isActive,
  ignoreTouches,
  ...props
}: ShortsItemProps) => {
  const { videoRef, isChangingTime } = useContext(ShortsItemContext);
  useActivePlayingSwiper(isActive, videoRef);
  const {
    onTimeUpdate,
    onVideoMetaDataLoad,
    onPauseVideo,
    onPlayVideo,
    onClickVideo,
  } = useUpdateVideoMetaInfo();

  return (
    <Video
      preload="auto"
      autoPlay={props.autoPlay}
      onLoadedMetadata={onVideoMetaDataLoad}
      onTimeUpdate={onTimeUpdate}
      videoRef={videoRef}
      src={shortsFile}
      className={styles.video}
      onPlay={onPlayVideo}
      onPause={onPauseVideo}
    >
      <Control
        isViewTimeSlider={isActive}
        onTouchEnd={() => {
          if (ignoreTouches === false && isChangingTime === false) {
            onClickVideo(videoRef);
          }
        }}
      />
    </Video>
  );
};
