import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./styles.module.scss";
import useBlockScroll from "@/shared/hooks/useBlockScroll";
import { Mousewheel } from "swiper/modules";
import { useContext, useEffect, useRef } from "react";
import { useShortsStyleRoot } from "./helpers/useShortsStyleRoot";
import { ShortsItemProvider } from "@/reusable-in-pages/contexts/ShortsContext/provider";
import { useGetShortsQuery } from "@/api/ShortsApi";
import ShortsListContext from "@/reusable-in-pages/contexts/ShortsListContext/context";
import { useInfinityShorts } from "./helpers/useInfinityShorts";
import { ShortsSlide } from "./components/ShortsSlide/ShortsSlide";
import useBackButton from "@/shared/hooks/useBackButton";
import { ErrorShorts } from "./components/Error/Error";
import { LoaderSpinner } from "@/ui/Icons";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import { setActiveShortsInfo } from "./slices/ShortsSlice";
import { Swiper as SwiperType } from "swiper";

const Shorts = () => {
  useBlockScroll();
  useShortsStyleRoot();
  useInfinityShorts();
  useBackButton();

  const dispatch = useAppDispatch();
  const swiperRef = useRef<SwiperType | null>(null);

  const { activeSlideIndex, setActiveSlideIndex, setSlideIgnoreTouches } =
    useContext(ShortsListContext);

  const { data, isLoading, error } = useGetShortsQuery();

  useEffect(() => {
    if (data) {
      dispatch(setActiveShortsInfo(data[0] ? data[0] : null));
    }
  }, [isLoading]);

  useEffect(() => {
    if (swiperRef.current && data) {
      dispatch(
        setActiveShortsInfo(
          data[swiperRef.current.activeIndex]
            ? data[swiperRef.current.activeIndex]
            : null
        )
      );
    }
  }, [data]);

  if (isLoading) {
    return (
      <>
        <LoaderSpinner className={styles.loader} />
      </>
    );
  }

  if (data) {
    return (
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        mousewheel
        speed={250}
        spaceBetween={0}
        modules={[Mousewheel]}
        className={styles.swiper}
        slidesPerView={1}
        onSliderMove={() => {
          setSlideIgnoreTouches(true);
        }}
        touchStartPreventDefault={false}
        touchStartForcePreventDefault={false}
        onTouchEnd={() => {
          setSlideIgnoreTouches(false);
        }}
        onSlideChangeTransitionEnd={() => {
          setSlideIgnoreTouches(false);
        }}
        onSlideChange={(swiper) => {
          setActiveSlideIndex(swiper.activeIndex);
          dispatch(
            setActiveShortsInfo(
              data[swiper.activeIndex] ? data[swiper.activeIndex] : null
            )
          );
        }}
        direction="vertical"
      >
        {data.map((el, index) => {
          return (
            <SwiperSlide key={index} className={styles.slide}>
              <ShortsItemProvider>
                <ShortsSlide
                  isLoadVideo={activeSlideIndex === index}
                  isActive={index === activeSlideIndex}
                  data={el}
                  autoPlay={index === 0}
                />
              </ShortsItemProvider>
            </SwiperSlide>
          );
        })}
      </Swiper>
    );
  }

  if (error) {
    return <ErrorShorts error={error} />;
  }
};

export default Shorts;
