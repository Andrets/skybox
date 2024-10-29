import styles from "./styles.module.scss";
import Header from "./components/Header/Header";
import ListEpisodeToggle from "./components/List/List";
import TogglePaginationEpisode from "./components/TogglePaginationEpisode/TogglePaginationEpisode";
import Marks from "./components/Marks/Marks";
import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { toggleListEpisodes } from "../../slices/FilmVideoSlice";
import { Drawer } from "@mui/material";
import { ListEpisodesProps } from "./model/ListEpisodesProps";
import { useGetFilmInfoQuery } from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";

const ListEpisodes = ({ episodes }: ListEpisodesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpen = useAppSelector((state) => state.filmVideo.isOpenListEpisodes);

  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(toggleListEpisodes(false));
  };

  const { id } = useParams();

  const { data: filmInfoData } = useGetFilmInfoQuery(id ? id : "", {
    skip: id ? false : true,
  });

  return (
    <Drawer
      open={isOpen}
      ref={containerRef}
      className={styles.listEpisodes}
      anchor="bottom"
    >
      <Header onClose={handleClose} />
      <Marks is_new={filmInfoData?.is_new} numEpisodes={episodes.length} />
      <TogglePaginationEpisode numEpisodes={episodes.length} />
      <ListEpisodeToggle episodes={episodes} />
    </Drawer>
  );
};

export default ListEpisodes;
