import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import EpisodeListButton from "../../ui/EpisodeListButton";
import styles from "./styles.module.scss";
import { ListEpisodesProps } from "../../model/ListEpisodesProps";
import { SeriesItem } from "@/shared/models/FilmInfoApi";
import { SerialContext } from "@/reusable-in-pages/contexts/SerialContext/context";
import { useContext } from "react";
import { toggleListEpisodes } from "@/modules/Serial/slices/FilmVideoSlice";

export const setListEpisodes = (
  episodes: SeriesItem[],
  paginationPage: number
) => {
  const arr: SeriesItem[] = [];
  for (
    let i = paginationPage * 30;
    i < Math.min(episodes.length, paginationPage * 30 + 30);
    i++
  ) {
    let el: SeriesItem = episodes[i];
    arr.push(el);
  }

  return arr;
};

const ListEpisodeToggle = ({ episodes }: ListEpisodesProps) => {
  const dispatch = useAppDispatch();
  const paginationPage = useAppSelector(
    (state) => state.filmVideo.paginationPage
  );
  const activeEpisode = useAppSelector(
    (state) => state.filmVideo.activeEpisode
  );

  const { swiperRef } = useContext(SerialContext);

  const handleClose = () => {
    dispatch(toggleListEpisodes(false));
  };

  const onClickSerial = (_: SeriesItem, index: number) => () => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index, 0);
    }

    handleClose();
  };
  return (
    <div className={styles.list}>
      {setListEpisodes(episodes, paginationPage).map((el, index) => {
        return (
          <EpisodeListButton
            isActive={activeEpisode === index}
            disabled={el.video ? false : true}
            onClick={onClickSerial(el, index)}
            key={index}
          >
            {index + 1}
          </EpisodeListButton>
        );
      })}
    </div>
  );
};

export default ListEpisodeToggle;
