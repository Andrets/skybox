import styles from "./styles.module.scss";
import MainInfo from "./components/MainInfo/MainInfo";
import { SectionHeader } from "@/ui/SectionHeader";
import CommentsBlock from "@/modules/FilmInfo/components/Info/components/Comments/Comments";
import AddComment from "@/modules/FilmInfo/components/Info/components/AddComment/AddComment";
import { ReactComponent as PlaySVG } from "@icons/Play.svg";
import { Link, useParams } from "react-router-dom";
import { FilmInfoProps } from "../../model/models";
import { useTranslation } from "react-i18next";
import { RatingFilm } from "./components/Rating/Rating";

const Info = ({
  description,
  comments,
  name,
  is_new,
  genre,
  rating,
  user_rating,
}: FilmInfoProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  return (
    <div className={`${styles.info}`}>
      <div className={`${styles.container} container`}>
        <MainInfo
          description={description}
          name={name}
          is_new={is_new}
          genre={genre}
          rating={rating}
        />

        <SectionHeader className={styles.sectHeader}>
          {t("rateFilm")}
        </SectionHeader>

        <RatingFilm rating={user_rating} />

        <SectionHeader className={styles.sectHeader}>
          {t("comments")}
        </SectionHeader>

        <CommentsBlock comments={comments} />

        <SectionHeader className={styles.sectHeader}>
          {t("addComment")}
        </SectionHeader>

        <AddComment />

        <Link to={`/filmVideo/${id}`} className={`${styles.link}`}>
          <PlaySVG /> {t("startPlay")}
        </Link>
      </div>
    </div>
  );
};

export default Info;
