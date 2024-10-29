import { TimeSlider } from "@/reusable-in-pages/components/Video";
import { createPortal } from "react-dom";
import styles from "./styles.module.scss";
import { useContext } from "react";
import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import { useUpdateVideoMetaInfo } from "../../helpers/ShortsItemHooks";

export const VideoTimeSlider = () => {
  const { videoLength, curTime, setIsChangingTime } =
    useContext(ShortsItemContext);

  const { onSliderChange } = useUpdateVideoMetaInfo();

  return (
    <>
      {createPortal(
        <TimeSlider
          sx={{
            position: "fixed",
            bottom: "68px",
            width: "100%",
            zIndex: "2",
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsChangingTime(true);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setIsChangingTime(false);
          }}
          value={curTime}
          max={videoLength}
          className={styles.timeSlider}
          onChange={(_, value) => {
            onSliderChange(value);
          }}
        />,
        document.body
      )}
    </>
  );
};
