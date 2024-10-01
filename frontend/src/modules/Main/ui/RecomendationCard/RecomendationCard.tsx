import { FC } from "react";
import styles from "./styles.module.scss";
import { LikeCardProps } from "./interface";
import { Link } from "react-router-dom";
import Poster from "@/ui/Poster/Poster";
export const RecomendationCard: FC<LikeCardProps> = ({ poster, name, to }) => {
  return (
    <Link to={to} className={styles.card}>
      <Poster poster={poster} />
      <p className={styles.name}>{name}</p>
    </Link>
  );
};
