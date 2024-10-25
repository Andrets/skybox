import styles from "./styles.module.scss";
import Header from "./components/Header/Header";
import ListEpisodeToggle from "./components/List/List";
import TogglePaginationEpisode from "./components/TogglePaginationEpisode/TogglePaginationEpisode";
import Marks from "./components/Marks/Marks";

import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { toggleListEpisodes } from "../../slices/FilmVideoSlice";
import { Drawer } from "@mui/material";

const ListEpisodes = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isOpen = useAppSelector((state) => state.filmVideo.isOpenListEpisodes);

  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(toggleListEpisodes(false));
  };

  return (
    <Drawer
      open={isOpen}
      ref={containerRef}
      className={styles.listEpisodes}
      anchor="bottom"
    >
      <Header onClose={handleClose} />
      <Marks />
      <TogglePaginationEpisode />
      <ListEpisodeToggle />
    </Drawer>
  );
};

export default ListEpisodes;
