import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./styles.module.scss";
import useBlockScroll from "@/shared/hooks/useBlockScroll";
import { Mousewheel } from "swiper/modules";
import { useContext } from "react";
import { useShortsStyleRoot } from "./helpers/useShortsStyleRoot";
import { ShortsItemProvider } from "@/reusable-in-pages/contexts/ShortsContext/provider";
import { useGetShortsQuery } from "@/api/ShortsApi";
import ShortsListContext from "@/reusable-in-pages/contexts/ShortsListContext/context";
import { useInfinityShorts } from "./helpers/useInfinityShorts";
import { ShortsSlide } from "./components/ShortsSlide/ShortsSlide";

const Shorts = () => {
  useBlockScroll(true);
  useShortsStyleRoot();
  useInfinityShorts();

  const { activeSlideIndex, setActiveSlideIndex, setSlideIgnoreTouches } =
    useContext(ShortsListContext);

  const { data, isLoading } = useGetShortsQuery();

  console.log(data, isLoading);

  if (isLoading) {
    return <></>;
  }

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
      onSlideChangeTransitionEnd={() => {
        setSlideIgnoreTouches(false);
      }}
      onSlideChange={(swiper) => {
        setActiveSlideIndex(swiper.activeIndex);
      }}
      direction="vertical"
    >
      {
        /* eslint-disable */
        data &&
          data.map((el, index) => {
            return (
              <SwiperSlide key={index} className={styles.slide}>
                <ShortsItemProvider>
                  <ShortsSlide
                    isActive={index === activeSlideIndex}
                    data={el}
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
