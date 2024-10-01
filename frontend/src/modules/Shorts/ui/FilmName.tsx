

import { FilmNameProps } from "@/reusable-in-pages/components/Video/models/FilmNameProps";
import styles from "./styles.module.scss";
import { FC } from "react";
export const FilmName: FC<FilmNameProps> = ({ name, episode }) => {
  return (
    <header className={styles.filmTitle}>
      <span className={styles.name}>{name}</span>
      <span className={styles.ep}>{` EP. ${episode}`}</span>
    </header>
  );
};
