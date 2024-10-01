import { CategoryFilmProps } from "./interface";
import styles from "./styles.module.scss";
import { FC } from "react";
import { ReactComponent as PlaySVG } from "@icons/Play.svg";
import Poster from "@/ui/Poster/Poster";
import { Link } from "react-router-dom";
export const CategoryFilm: FC<CategoryFilmProps> = ({ poster, to }) => {
  return (
    <Poster poster={poster} className={styles.container}>
      <Link to={to} className={styles.playBtn}>
        <PlaySVG /> <span className={styles.txt}>Play</span>
      </Link>
    </Poster>
  );
};
