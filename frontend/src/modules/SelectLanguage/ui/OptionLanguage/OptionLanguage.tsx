import { OptionLanguageProps } from "../../model/OptionLanguageProps";
import { Button } from "@mui/material";
import styles from "./styles.module.scss";
import { ReactComponent as CheckSVG } from "@icons/Check.svg";
export const OptionLanguage = ({
  className,
  isActive = false,
  title,
  subtitle,
  onClick,
}: OptionLanguageProps) => {
  return (
    <Button
      sx={{
        width: "100%",
        justifyContent: "space-between",
        minHeight: "none",
        minWidth: "none",
        padding: "24px 8px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
      }}
      onClick={onClick}
      className={`${styles.container} ${className}`}
    >
      <span className={styles.lang}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>

      {isActive && <CheckSVG />}
    </Button>
  );
};
