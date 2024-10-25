import { SwiperSlide, Swiper } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import styles from "./styles.module.scss";

import { VideoSeriesItem } from "./components/VideoSeriesItem/VideoSeriesItem";
import { useContext } from "react";
import { SerialContext } from "@/reusable-in-pages/contexts/SerialContext/context";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { setActiveEpisode, setVideoCurTime } from "../../slices/FilmVideoSlice";
export const VideoSeries = () => {
  const { swiperRef } = useContext(SerialContext);
  const activeEpisode = useAppSelector(
    (state) => state.filmVideo.activeEpisode
  );
  const dispatch = useAppDispatch();

  const onSlideChange = (swiper: SwiperType) => {
    dispatch(setActiveEpisode(swiper.activeIndex));
    dispatch(setVideoCurTime(0));
  };

  return (
    <Swiper
      slidesPerView={1}
      onBeforeInit={(swiper) => {
        swiperRef.current = swiper;
      }}
      className={styles.container}
      onSlideChange={onSlideChange}
      direction="vertical"
    >
      <SwiperSlide className={styles.slide}>
        <VideoSeriesItem isActive={activeEpisode === 0} />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <VideoSeriesItem isActive={activeEpisode === 1} />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <VideoSeriesItem isActive={activeEpisode === 2} />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <VideoSeriesItem isActive={activeEpisode === 3} />
      </SwiperSlide>
    </Swiper>
  );
};
