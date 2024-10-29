import { FilmNameProps } from "../../models/FilmNameProps";
import { FC, memo } from "react";
import styles from "./styles.module.scss";
export const FilmName: FC<FilmNameProps> = memo(
  ({ name, episode, className }) => {
    return (
      <header className={`${styles.filmTitle} ${className}`}>
        <span className={styles.name}>{name}</span>
        <span className={styles.ep}>{` EP. ${episode}`}</span>
      </header>
    );
  },
  (np, pp) => {
    return pp.name === np.name && pp.episode === np.episode;
  }
);
