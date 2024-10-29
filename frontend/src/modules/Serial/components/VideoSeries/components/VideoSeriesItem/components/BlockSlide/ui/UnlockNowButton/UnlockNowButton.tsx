import { Button, ButtonProps } from "@mui/material";
import styles from "./styles.module.scss";
import { ReactComponent as LockSVG } from "@icons/Lock.svg";
export const UnlockNowButton = ({ children, ...restProps }: ButtonProps) => {
  return (
    <Button
      sx={{ maxWidth: undefined, maxHeight: undefined, zIndex: 2 }}
      className={` ${restProps.className} ${styles.button}`}
      {...restProps}
    >
      <LockSVG className={styles.lockSVG} /> {children}
    </Button>
  );
};
