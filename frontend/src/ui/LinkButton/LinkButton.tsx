import { Button } from "@mui/material";
import { ReactComponent as ArrowRight } from "@icons/ArrowRight.svg";
import styles from "./styles.module.scss";
import { LinkButtonProps } from "./interface";

export const LinkButton = ({ children, className, onClick }: LinkButtonProps) => {
  return (
    <Button
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        minWidth: 0,
      }}
      onClick={onClick}
      className={`${styles.container} ${className}`}
    >
      {children} <ArrowRight />
    </Button>
  );
};
