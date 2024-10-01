import SideButtons from "./ui/SideButtons/SideButtons";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { VideoTimeSlider } from "./ui/TimeSlider/VideoTimeSlider";
import { FilmName, PlayButton } from "@/reusable-in-pages/components/Video";
import { ControlProps } from "@/reusable-in-pages/components/Video/models/ControlProps";
export const Control = ({ onClickPlay, onSliderChange }: ControlProps) => {
  const isPlaying = useAppSelector((state) => state.filmVideo.isPlayVideo);
  const isView = useAppSelector((state) => state.filmVideo.isViewControlVideo);

  return (
    <>
      {isView && (
        <div className={styles.control}>
          <PlayButton
            isPlay={isPlaying}
            onClick={onClickPlay}
            className={styles.playBtn}
          />
          <SideButtons />

          <FilmName
            className={styles.name}
            name={"Love the way you lie"}
            episode={1}
          />

          <VideoTimeSlider onChange={onSliderChange} />
        </div>
      )}
    </>
  );
};
