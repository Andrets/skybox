import { Img } from "react-image";
import { SwiperSlide, Swiper } from "swiper/react";
import LoaderSkeletonImage from "@/ui/LoaderSkeletonImage/LoaderSkeletonImage";
import styles from "./styles.module.scss";
import { Pagination } from "swiper/modules";
import "./styles.scss";
import { FilmAssetsProps } from "../../model/models";

const FilmAssets = ({ photos }: FilmAssetsProps) => {
  if (photos.length === 0) {
    return <></>;
  }
  return (
    <Swiper
      spaceBetween={16}
      modules={[Pagination]}
      pagination
      className={styles.swiper}
    >
      {photos.map((el, index) => {
        return (
          <SwiperSlide key={index} className={styles.slide}>
            <Img src={el} loader={<LoaderSkeletonImage />} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default FilmAssets;
