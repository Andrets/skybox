import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { Skeleton } from "@mui/material";
import styles from "./styles.module.scss";
export const Loading = () => {
  return (
    <Swiper
      className={`${styles.swiper} category-list__swiper`}
      slidesPerView={"auto"}
      breakpoints={{
        450: { centeredSlides: false, slidesPerView: 2 },
        767: { slidesPerView: 3, centeredSlides: false },
      }}
      spaceBetween={15}
      pagination={true}
      centeredSlides
      loopPreventsSliding
      autoplay={{
        delay: 5000,
      }}
    >
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
