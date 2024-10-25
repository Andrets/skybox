import { CategoryFilmProps } from "./interface";
import styles from "./styles.module.scss";
import { FC } from "react";
import { ReactComponent as PlaySVG } from "@icons/Play.svg";
import Poster from "@/ui/Poster/Poster";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

export const CategoryFilm: FC<CategoryFilmProps> = ({ poster, to }) => {
  const { t } = useTranslation();
  return (
    <Link to={to}>
      <Poster poster={poster} className={styles.container}>
        <Button className={styles.playBtn}>
          <PlaySVG /> <span className={styles.txt}>{t("startPlay")}</span>
        </Button>
      </Poster>
    </Link>
  );
};
