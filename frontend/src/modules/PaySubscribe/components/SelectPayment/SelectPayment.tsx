import { AddCardForm } from "@/reusable-in-pages/components/AddCard";

import starIMG from "@images/star.png";
import { Button } from "@mui/material";

import styles from "./styles.module.scss";
import { ReactComponent as ArrowRight } from "@icons/ArrowRight.svg"

export const SelectPayment = () => {
  return (
    <div className={styles.container}>
      <AddCardForm className={styles.cardForm} />
      <Button
        className={styles.tgBtn}
        sx={{
          maxHeight: undefined,
          maxWidth: undefined,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>
          <img width={24} height={24} src={starIMG} alt="" />{" "}
          <span>Telegram stars</span>
        </span>

        <ArrowRight />
      </Button>
    </div>
  );
};
