import { Button } from "@mui/material";
import { TypeSubscribeBannerModel } from "../../modules/PaySubscribe/model/models";
import styles from "./styles.module.scss";

export const TypeSubscribeBanner = ({
  header,
  description,
  price,
  isActive,
  className,
  ...restProps
}: TypeSubscribeBannerModel) => {
  return (
    <Button
      className={`${styles.subBtn} ${
        isActive && styles.activeSubBtn
      } ${className}`}
      disableRipple
      disableTouchRipple
      {...restProps}
      sx={{
        minWidth: undefined,
        maxWidth: undefined,
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        flexDirection: "column",
        alignItems: "flex-start",
        background: "rgba(33, 29, 29, 1)",
        margin: undefined,
      }}
    >
      <span className={styles.header}>{header}</span>
      <span className={styles.price}>{price}</span>
      <span className={styles.description}>{description}</span>
    </Button>
  );
};
