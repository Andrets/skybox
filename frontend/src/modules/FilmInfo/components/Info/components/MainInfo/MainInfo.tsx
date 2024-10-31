import styles from "./styles.module.scss";
import { SectionHeader } from "@/ui/SectionHeader";
import { Rating } from "@mui/material";
import FilmDescription from "./Description/Description";
import AttentionMark from "@/ui/marks/Attention/AttentionMark";
import StandartMark from "@/ui/marks/Standart/StandartMark";
import { FilmMainInfoProps } from "@/modules/FilmInfo/model/models";
const MainInfo = ({
  name,
  rating,
  description,
  genre,
  is_new,
}: Omit<FilmMainInfoProps, "user_rating">) => {
  return (
    <div className={styles.main}>
      <SectionHeader className={styles.title}>{name}</SectionHeader>

      <Rating
        size="small"
        color="blue"
        className={styles.rating}
        value={rating}
        readOnly
      />

      <FilmDescription text={description} />

      <ul className={styles.marks}>
        {is_new && (
          <li className={styles.markItem}>
            <AttentionMark>New</AttentionMark>
          </li>
        )}

        {genre && genre.length > 0 && (
          <li className={styles.markItem}>
            <StandartMark>{genre}</StandartMark>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MainInfo;
