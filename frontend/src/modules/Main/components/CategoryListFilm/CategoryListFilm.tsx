import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import styles from "./styles.module.scss";
import { Pagination } from "swiper/modules";

import { CategoryListFilmProps } from "./interface";
import { FC } from "react";

import posterIMG from "@images/poster.png";
import "./styles.scss";
import { CategoryFilm } from "../../ui";

export const CategoryListFilm: FC<CategoryListFilmProps> = () => {
  return (
    <Swiper
      className={`${styles.swiper} category-list__swiper`}
      slidesPerView={"auto"}
      spaceBetween={15}
      modules={[Pagination]}
      pagination={{ dynamicBullets: true, dynamicMainBullets: 3 }}
      centeredSlides={true}
      initialSlide={1}
    >
      <SwiperSlide className={styles.slide}>
        <CategoryFilm to="/filmVideo" poster={posterIMG} />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <CategoryFilm to="/filmVideo" poster={posterIMG} />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <CategoryFilm to="/filmVideo" poster={posterIMG} />
      </SwiperSlide>
    </Swiper>
  );
};
