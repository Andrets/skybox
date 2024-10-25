import styles from "./styles.module.scss";
import { FC } from "react";
import { ExclusiveCardProps } from "./interface";
import AttentionMark from "@/ui/marks/Attention/AttentionMark";
import StandartMark from "@/ui/marks/Standart/StandartMark";
import Poster from "@/ui/Poster/Poster";
import { Link } from "react-router-dom";

export const ExclusiveFilmCard: FC<ExclusiveCardProps> = ({
  poster,
  name,
  category,
  status,
  to,
}) => {

  return (
    <Link to={to}>
      <Poster poster={poster} className={styles.poster}>
        <StandartMark className={styles.category}>{category}</StandartMark>
        <AttentionMark className={styles.status}>{status}</AttentionMark>
      </Poster>

      <p className={styles.name}>{name}</p>
    </Link>
  );
};
