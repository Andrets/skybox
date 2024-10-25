import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { ExclusiveFilmCard } from "@/modules/Main/ui";
import styles from "./styles.module.scss";
import { ExclusiveListProps } from "@/modules/Main/models/models";

export const ExclusiveList = ({ data }: ExclusiveListProps) => {
  return (
    <Swiper
      autoplay={{ delay: 5000 }}
      className={styles.swiper}
      slidesPerView={"auto"}
      spaceBetween={8}
      modules={[Autoplay]}
    >
      {data.map((el) => {
        return (
          <SwiperSlide key={el.id} className={styles.slide}>
            
            <ExclusiveFilmCard
              to={`/filmInfo/${el.id}`}
              poster={String(el.vertical_photo)}
              name={el.name}
              category={el.genre}
              status={"New"}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
