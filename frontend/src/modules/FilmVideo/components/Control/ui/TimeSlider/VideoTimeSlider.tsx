import { SliderProps } from "@mui/material";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { TimeSlider } from "@/reusable-in-pages/components/Video";
export const VideoTimeSlider = ({ onChange }: SliderProps) => {
  const videoLength = useAppSelector((state) => state.filmVideo.videoLength);
  const videoCurTime = useAppSelector((state) => state.filmVideo.videoCurTime);
  return (
    <div className={styles.timeSlider}>
      <TimeSlider
        onChange={onChange}
        min={0}
        max={videoLength}
        value={videoCurTime}
      />
    </div>
  );
};
