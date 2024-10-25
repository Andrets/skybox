import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./styles.module.scss";
import { Skeleton } from "@mui/material";

export const ExclusiveLoading = () => {
  return (
    <Swiper className={styles.swiper} slidesPerView={"auto"} spaceBetween={8}>
      <SwiperSlide className={styles.slide}>
        <Skeleton sx={{ aspectRatio: "137/204" }} />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <Skeleton sx={{ aspectRatio: "137/204" }} />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <Skeleton sx={{ aspectRatio: "137/204" }} />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <Skeleton sx={{ aspectRatio: "137/204" }} />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <Skeleton sx={{ aspectRatio: "137/204" }} />
      </SwiperSlide>
    </Swiper>
  );
};
