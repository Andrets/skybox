import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./styles.module.scss";
import useBlockScroll from "@/shared/hooks/useBlockScroll";

import { ShortsItem } from "./components/ShortsItem/ShortsItem";
import { Mousewheel } from "swiper/modules";
import { useState } from "react";
import { useShortsStyleRoot } from "./helpers/useShortsStyleRoot";
import { ShortsItemProvider } from "@/reusable-in-pages/contexts/ShortsContext/provider";

const ARRAY = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

const Shorts = () => {
  useBlockScroll(true);
  useShortsStyleRoot();

  const [activeSwiperIndex, setActiveSwiperIndex] = useState(0);
  const [slideIgnoreTouches, setSlideIgnoreTouches] = useState(false);

  return (
    <Swiper
      mousewheel
      speed={250}
      spaceBetween={0}
      modules={[Mousewheel]}
      className={styles.swiper}
      slidesPerView={1}
      onSliderMove={() => {
        setSlideIgnoreTouches(true);
      }}
      onBeforeSlideChangeStart={() => {
        setSlideIgnoreTouches(false);
      }}
      onSlideChange={(swiper) => {
        setActiveSwiperIndex(swiper.activeIndex);
      }}
      direction="vertical"
    >
      {
        /* eslint-disable */
        ARRAY.map((el, index) => {
          console.log(el);
          return (
            <SwiperSlide className={styles.slide}>
              <ShortsItemProvider>
                <ShortsItem
                  ignoreTouches={slideIgnoreTouches}
                  isActive={index === activeSwiperIndex}
                />
              </ShortsItemProvider>
            </SwiperSlide>
          );
        })
        /* eslint-enable */
      }
    </Swiper>
  );
};

export default Shorts;
