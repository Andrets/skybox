import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./styles.module.scss";
import "swiper/css";
import posterIMG from "@images/poster.png";
import lazyIMG from "@images/image.jpg";
import { ExclusiveFilmCard } from "../../ui";

export const ExclusiveOriginals = () => {
  return (
    <Swiper className={styles.swiper} slidesPerView={"auto"} spaceBetween={8}>
      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={posterIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={posterIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={posterIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={posterIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={posterIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={posterIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={posterIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={posterIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>
      <SwiperSlide className={styles.slide}>
        <ExclusiveFilmCard
          to="/filmInfo"
          poster={lazyIMG}
          name={`In The Name of Motherhood`}
          category={"Family"}
          status={"New"}
        />
      </SwiperSlide>
    </Swiper>
  );
};
