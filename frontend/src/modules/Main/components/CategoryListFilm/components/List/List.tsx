import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import { CategoryFilm } from "@/modules/Main/ui";
import styles from "./styles.module.scss";
import { TopSerialListProps } from "@/modules/Main/models/models";

export const List = ({ data }: TopSerialListProps) => {
  return (
    <Swiper
      className={`${styles.swiper} category-list__swiper`}
      slidesPerView={"auto"}
      loop
      breakpoints={{
        450: {
          centeredSlides: false,
          slidesPerView: 2,
          coverflowEffect: {
            scale: 1,
            rotate: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
          },
        },
        767: {
          slidesPerView: 3,
          centeredSlides: false,
          coverflowEffect: {
            scale: 1,
            rotate: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
          },
        },
      }}
      spaceBetween={15}
      effect="coverflow"
      coverflowEffect={{
        scale: 0.8,
        rotate: 0,
        depth: 0,
        modifier: 1,
        slideShadows: false,
      }}
      modules={[Pagination, Autoplay, EffectCoverflow]}
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
              poster={el.vertical_photo ? el.vertical_photo : ""}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
