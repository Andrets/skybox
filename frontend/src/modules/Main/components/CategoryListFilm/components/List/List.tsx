import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { CategoryFilm } from "@/modules/Main/ui";
import styles from "./styles.module.scss";
import { TopSerialListProps } from "@/modules/Main/models/models";
import { transformPathToPhoto } from "@/shared/helpers/transformPathToPhoto";

export const List = ({ data }: TopSerialListProps) => {
  return (
    <Swiper
      className={`${styles.swiper} category-list__swiper`}
      slidesPerView={"auto"}
      breakpoints={{
        450: { centeredSlides: false, slidesPerView: 2 },
        767: { slidesPerView: 3, centeredSlides: false },
      }}
      spaceBetween={15}
      modules={[Pagination, Autoplay]}
      pagination={true}
      centeredSlides
      loopPreventsSliding
      autoplay={{
        delay: 5000,
      }}
    >
      {data.map((el) => {
        return (
          <SwiperSlide className={styles.slide} key={el.id}>
            <CategoryFilm
              to={`/filmVideo/${el.id}`}
              poster={transformPathToPhoto(el.vertical_photo)}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
