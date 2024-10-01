import { Link } from "react-router-dom";
import { LikesItemProps } from "../../model/LikesItemProps";
import Poster from "@/ui/Poster/Poster";
import styles from "./styles.module.scss";

export const LikeItem = ({ to, className, name, poster }: LikesItemProps) => {
  return (
    <Link className={`${styles.container} ${className}`} to={to}>
      <Poster poster={poster} />
      <span className={styles.name}>{name}</span>
    </Link>
  );
};
