import type { PeopleSearchingItemProps } from "./interface";
import { FC } from "react";
import Poster from "@/ui/Poster/Poster";
import styles from "./styles.module.scss";
import Info from "./Info/Info";
import StandartMark from "@/ui/marks/Standart/StandartMark";
import { Link } from "react-router-dom";

export const ResultItem: FC<PeopleSearchingItemProps> = ({
  status,
  poster,
  category,
  header,
  to,
}) => {
  return (
    <Link to={to} className={styles.container}>
      <Poster className={styles.poster} poster={poster}>
        <>
          {category && (
            <StandartMark className={styles.category}>{category}</StandartMark>
          )}
        </>
      </Poster>
      <Info header={header} status={status} />
    </Link>
  );
};
