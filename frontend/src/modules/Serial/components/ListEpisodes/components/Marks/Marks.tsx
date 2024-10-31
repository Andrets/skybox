import AttentionMark from "@/ui/marks/Attention/AttentionMark";
import StandartMark from "@/ui/marks/Standart/StandartMark";
import styles from "./styles.module.scss";
import { MarksProps } from "../../model/MarksProps";
import { useTranslation } from "react-i18next";
const Marks = ({ is_new, numEpisodes }: MarksProps) => {
  const { t } = useTranslation();
  return (
    <ul className={styles.marksList}>
      {is_new && (
        <li>
          <AttentionMark>NEW</AttentionMark>
        </li>
      )}

      <li>
        <StandartMark> {t("allEpisodes", { numEpisodes })} </StandartMark>
      </li>
    </ul>
  );
};

export default Marks;
