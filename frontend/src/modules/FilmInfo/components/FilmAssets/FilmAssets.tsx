import { Img } from "react-image";
import { SwiperSlide, Swiper } from "swiper/react";
import posterIMG from "@images/poster.png";
import LoaderSkeletonImage from "@/ui/LoaderSkeletonImage/LoaderSkeletonImage";
import styles from "./styles.module.scss";
import { Pagination } from "swiper/modules";
import "./styles.scss";

const FilmAssets = () => {
  
  return (
    <Swiper
      spaceBetween={16}
      modules={[Pagination]}
      pagination
      className={styles.swiper}
    >
      <SwiperSlide className={styles.slide}>
        <Img src={posterIMG} loader={<LoaderSkeletonImage />} />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <Img src={posterIMG} loader={<LoaderSkeletonImage />} />
      </SwiperSlide>

      <SwiperSlide className={styles.slide}>
        <Img src={posterIMG} loader={<LoaderSkeletonImage />} />
      </SwiperSlide>
    </Swiper>
  );
};

export default FilmAssets;
