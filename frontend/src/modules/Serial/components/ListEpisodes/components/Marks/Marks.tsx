import AttentionMark from "@/ui/marks/Attention/AttentionMark";
import StandartMark from "@/ui/marks/Standart/StandartMark";
import styles from "./styles.module.scss";
import { MarksProps } from "../../model/MarksProps";
const Marks = ({ is_new, numEpisodes }: MarksProps) => {
  return (
    <ul className={styles.marksList}>
      {is_new && (
        <li>
          <AttentionMark>NEW</AttentionMark>
        </li>
      )}

      <li>
        <StandartMark>all {numEpisodes} episodes</StandartMark>
      </li>
    </ul>
  );
};

export default Marks;
