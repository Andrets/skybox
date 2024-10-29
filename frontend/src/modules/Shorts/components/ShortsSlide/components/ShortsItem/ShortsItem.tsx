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
import { useVideoSrc } from "./helpers/useVideoSrc";
import { useMetrikQuery } from "./helpers/useMetrikQuery";

export const ShortsItem = ({
  isActive,
  serial_id,
  video,
  episode,
  name,
  likes,
  is_liked,
  shorts_id,
  isLoadVideo,

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
  const videoSrc = useVideoSrc(isLoadVideo, video);

  useMetrikQuery(isActive, shorts_id);

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
      src={videoSrc}
      className={styles.video}
      onPlay={onPlayVideo}
      onPause={onPauseVideo}
      onWaiting={onWaiting}
      onPlaying={onPlaying}
    >
      <Control
        serail_id={serial_id}
        shorts_id={shorts_id}
        likes={likes}
        is_liked={is_liked}
        episode={episode}
        name={name}
        isViewTimeSlider={isActive}
        onMouseDown={onMouseDown}
      />
    </Video>
  );
};
