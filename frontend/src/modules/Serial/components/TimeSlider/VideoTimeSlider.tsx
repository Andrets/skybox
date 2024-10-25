import { SliderProps } from "@mui/material";
import styles from "./styles.module.scss";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { TimeSlider } from "@/reusable-in-pages/components/Video";
export const VideoTimeSlider = ({ onChange, ...restProps }: SliderProps) => {
  const videoLength = useAppSelector((state) => state.filmVideo.videoLength);
  const videoCurTime = useAppSelector((state) => state.filmVideo.videoCurTime);

  // Функция для создания и отправки кастомного события
  const triggerCustomEvent = (value: number | number[]) => {
    const customEvent = new CustomEvent("sliderUserChangeEvent", {
      detail: { value }, // передаем текущее значение слайдера
    });
    window.dispatchEvent(customEvent); // отправляем событие
  };

  const handleChange = (_: Event, newValue: number | number[]) => {
    triggerCustomEvent(newValue); // триггерим кастомное событие
  };


  return (
    <div className={styles.timeSlider}>
      <TimeSlider
        {...restProps}
        className={styles.slider}
        onChange={(e, value, activeThumb) => {
          handleChange(e, value);
          if (onChange) onChange(e, value, activeThumb);
        }}
        min={0}
        max={videoLength}
        value={videoCurTime}
      />
    </div>
  );
};
