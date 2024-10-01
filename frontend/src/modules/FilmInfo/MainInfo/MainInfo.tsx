import styles from "./styles.module.scss";
import { SectionHeader } from "@/ui/SectionHeader";
import { Rating } from "@mui/material";
import FilmDescription from "./Description/Description";
import AttentionMark from "@/ui/marks/Attention/AttentionMark";
import StandartMark from "@/ui/marks/Standart/StandartMark";
const MainInfo = () => {
  return (
    <div className={styles.main}>
      <SectionHeader className={styles.title}>Game of Thrones</SectionHeader>

      <Rating
        size="small"
        color="blue"
        className={styles.rating}
        value={3}
        readOnly
      />

      <FilmDescription
        text={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
      />

      <ul className={styles.marks}>
        <li className={styles.markItem}>
          <AttentionMark>New</AttentionMark>
        </li>

        <li className={styles.markItem}>
          <StandartMark>Family</StandartMark>
        </li>
      </ul>
    </div>
  );
};

export default MainInfo;
