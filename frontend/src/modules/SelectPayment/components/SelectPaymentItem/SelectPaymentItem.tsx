import { Button } from "@mui/material";
import { SelectPaymentItemProps } from "../../model/SelectPaymentItemProps";
import styles from "./styles.module.scss";
import { ReactComponent as CheckboxSVG } from "@icons/Check.svg";

export const SelectPaymentItem = ({
  isActive,
  icon,
  titleText,
  subtitleText,
  className,
}: SelectPaymentItemProps) => {
  return (
    <Button
      sx={{ maxWidth: undefined, minWidth: undefined, display: "grid" }}
      className={`${className} ${styles.btn}`}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.main}>
        <span className={styles.title}>{titleText}</span>
        <span className={styles.subtitle}>{subtitleText}</span>
      </span>

      {isActive && (
        <span className={styles.check}>
          <CheckboxSVG />
        </span>
      )}
    </Button>
  );
};
