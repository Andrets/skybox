import { DescriptionProps } from "./interface";
import { FC,  useState } from "react";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
const FilmDescription: FC<DescriptionProps> = ({ text }) => {

  const [openAllText, setOpenAllText] = useState(text.length < 100);

  const hiddenText = () => {
    return `${text.slice(0, 100)}...`;
  };
  const onClickMoreText: React.MouseEventHandler<HTMLButtonElement> = () => {
    setOpenAllText(true);
  };

  return (
    <div className={`${styles.description} ${!openAllText && styles.hidden}`}>
      <span className={styles.text}>{openAllText ? text : hiddenText()}</span>

      {!openAllText && (
        <Button
          onClick={onClickMoreText}
          className={styles.moreBtn}
          variant="text"
        >
          More...
        </Button>
      )}
    </div>
  );
};

export default FilmDescription;
