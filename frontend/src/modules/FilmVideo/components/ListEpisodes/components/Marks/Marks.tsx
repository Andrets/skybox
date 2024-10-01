import AttentionMark from "@/ui/marks/Attention/AttentionMark";
import StandartMark from "@/ui/marks/Standart/StandartMark";
import styles from "./styles.module.scss";
const Marks = () => {
  return (
    <ul className={styles.marksList}>
      <li>
        <AttentionMark>NEW</AttentionMark>
      </li>
      <li>
        <StandartMark>all 56 episodes</StandartMark>
      </li>
    </ul>
  );
};

export default Marks;
