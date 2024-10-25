import { Video } from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";
import { Control } from "./ui/Control";
import { ShortsItemProps } from "../../../../models/ShortsItemProps";
import {
  useActivePlayingSwiper,
  useUpdateVideoMetaInfo,
  useUserIsView,
} from "./helpers/ShortsItemHooks";
import { useContext } from "react";
import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import ShortsListContext from "@/reusable-in-pages/contexts/ShortsListContext/context";

export const ShortsItem = ({
  isActive,
  serial_id,
  video,
  episode,
  name,
  ...props
}: ShortsItemProps) => {
  const { videoRef, isChangingTime } = useContext(ShortsItemContext);
  const { slideIgnoreTouches: ignoreTouches } = useContext(ShortsListContext);
  useActivePlayingSwiper(isActive, videoRef);
  useUserIsView(isActive, serial_id);
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
      src={video}
      className={styles.video}
      onPlay={onPlayVideo}
      onPause={onPauseVideo}
    >
      <Control
        episode={episode}
        name={name}
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
