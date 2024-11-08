import { Video } from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";
import { Control } from "./ui/Control";
import { ShortsItemProps } from "../../../../models/ShortsItemProps";
import {
  useActivePlayingSwiper,
  useUpdateVideoMetaInfo,
} from "./helpers/ShortsItemHooks";
import { MouseEventHandler, useContext } from "react";
import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import ShortsListContext from "@/reusable-in-pages/contexts/ShortsListContext/context";
import { useMetrikQuery } from "./helpers/useMetrikQuery";

export const ShortsItem = ({
  isActive,
  video,
  isLoadVideo,
  series_id,
  ...props
}: ShortsItemProps) => {
  const { videoRef, isChangingTime } = useContext(ShortsItemContext);
  const { slideIgnoreTouches: ignoreTouches } = useContext(ShortsListContext);

  useActivePlayingSwiper(isActive, videoRef);
  const {
    onTimeUpdate,
    onVideoMetaDataLoad,
    onPauseVideo,
    onPlayVideo,
    onClickVideo,
    onPlaying,
    onWaiting,
  } = useUpdateVideoMetaInfo();

  useMetrikQuery(isActive, series_id);

  const onMouseDown: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
    if (ignoreTouches === false && isChangingTime === false) {
      onClickVideo(videoRef);
    }
  };

  return (
    <Video
      preload="metadata"
      autoPlay={props.autoPlay}
      onLoadedMetadata={onVideoMetaDataLoad}
      onTimeUpdate={onTimeUpdate}
      videoRef={videoRef}
      src={isLoadVideo ? video : ""}
      className={styles.video}
      onPlay={onPlayVideo}
      onPause={onPauseVideo}
      onWaiting={onWaiting}
      onPlaying={onPlaying}
    >
      <Control isViewTimeSlider={isActive} onMouseDown={onMouseDown} />
    </Video>
  );
};
