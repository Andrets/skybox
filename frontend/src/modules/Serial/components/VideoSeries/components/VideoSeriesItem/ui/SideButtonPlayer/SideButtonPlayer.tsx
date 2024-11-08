import { Button, ButtonProps } from "@mui/material";
import styles from "./styles.module.scss";
export const SideButtonPlayer = ({
  children,
  className,
  ...restProps
}: ButtonProps) => {
  return (
    <Button
      {...restProps}
      sx={{ padding: 0, minWidth: "64px" }}
      className={`${styles.btn} ${className}`}
    >
      {children}
    </Button>
  );
};
