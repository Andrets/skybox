import styles from "./styles.module.scss";
import Header from "./components/Header/Header";
import ListEpisodeToggle from "./components/List/List";
import TogglePaginationEpisode from "./components/TogglePaginationEpisode/TogglePaginationEpisode";
import Marks from "./components/Marks/Marks";
import { ListEpisodesProps } from "./model/ListEpisodesProps";

import { FC, useRef, useState } from "react";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import { toggleListEpisodes } from "../../slices/FilmVideoSlice";
import { useSetContainerHeight, useSetHeightResizeWindow } from "./helpers/setContainerHeight";
const ListEpisodes: FC<ListEpisodesProps> = ({ isOpen }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(toggleListEpisodes(false));
  };

  useSetContainerHeight(isOpen, setHeight, containerRef)
  useSetHeightResizeWindow(isOpen, contentRef, setHeight)

  return (
    <div
      ref={containerRef}
      style={{ height: height }}
      className={styles.listEpisodes}
    >
      <div
        ref={contentRef}
        className={`container no-padding ${styles.container}`}
      >
        <Header onClose={handleClose} />
        <Marks />
        <TogglePaginationEpisode />
        <ListEpisodeToggle />
      </div>
    </div>
  );
};

export default ListEpisodes;
