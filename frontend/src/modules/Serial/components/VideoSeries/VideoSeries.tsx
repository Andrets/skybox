import { SwiperSlide, Swiper } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import styles from "./styles.module.scss";
import { VideoSeriesItem } from "./components/VideoSeriesItem/VideoSeriesItem";
import { useContext, useEffect } from "react";
import { SerialContext } from "@/reusable-in-pages/contexts/SerialContext/context";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import {
  setActiveEpisode,
  setIsCurrentSeriesInfoData,
  setVideoCurTime,
} from "../../slices/FilmVideoSlice";
import { VideoSeriesProps } from "../../model/models";
import { VideoSeriesItemProvider } from "@/reusable-in-pages/contexts/VideoSeriesItemContext/provider";
import { Mousewheel } from "swiper/modules";
import { SeriesItem } from "@/shared/models/FilmInfoApi";

const setFilmSeries = (arr: SeriesItem[]) => {
  const res: SeriesItem[] = [];
  for (let i = 0; i < arr.length; i++) {
    let el = arr[i];
    res.push(el);

    if (!el.status) {
      return res;
    }
  }

  return res;
};
export const VideoSeries = ({ series }: VideoSeriesProps) => {
  const { swiperRef } = useContext(SerialContext);
  const activeEpisode = useAppSelector(
    (state) => state.filmVideo.activeEpisode
  );

  const dispatch = useAppDispatch();

  const onSlideChange = (swiper: SwiperType) => {
    dispatch(setActiveEpisode(swiper.activeIndex));
    dispatch(setVideoCurTime(0));
    dispatch(
      setIsCurrentSeriesInfoData(
        series[swiper.activeIndex] ? series[swiper.activeIndex] : null
      )
    );
  };

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      dispatch(
        setIsCurrentSeriesInfoData(
          series[swiper.activeIndex] ? series[swiper.activeIndex] : null
        )
      );
    }
  }, [series]);

  return (
    <>
      <Swiper
        slidesPerView={1}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        className={styles.container}
        onSlideChange={onSlideChange}
        direction="vertical"
        mousewheel
        modules={[Mousewheel]}
      >
        {setFilmSeries(series).map((el, index) => {
          return (
            <SwiperSlide key={index} className={styles.slide}>
              <VideoSeriesItemProvider>
                <VideoSeriesItem
                  isAvailable={el.status}
                  src={activeEpisode === index ? el.video : undefined}
                  episode={el.episode}
                  isActive={activeEpisode === index}
                />
              </VideoSeriesItemProvider>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};
