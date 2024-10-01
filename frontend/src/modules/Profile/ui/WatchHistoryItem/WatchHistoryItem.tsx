import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { WatchHistoryItemProps } from "../../model/WatchHistoryItemProps";
import Poster from "@/ui/Poster/Poster";
export const WatchHistoryItem = ({
  className,
  to,
  poster,
  name,
}: WatchHistoryItemProps) => {
  return (
    <Link className={`${className} ${styles.link}`} to={to}>
      <Poster className={styles.poster} poster={poster} />
      <span className={styles.name}>{name}</span>
    </Link>
  );
};
