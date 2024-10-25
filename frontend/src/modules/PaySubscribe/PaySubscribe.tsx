import { SelectPayment, SelectSubscribe } from "./components";
import { Button } from "@mui/material";
import styles from "./styles.module.scss";
import { useContext } from "react";
import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";
import { useTranslation } from "react-i18next";
export const PaySubscribe = () => {
  const {
    formHook: {
      formState: { isValid },
    },
  } = useContext(AddCardContext);

  const { t } = useTranslation();

  return (
    <form className={`container ${styles.form}`}>
      <SelectSubscribe />

      <SelectPayment />

      <div className={styles.payBtnCont}>
        <Button
          className={`${styles.payBtn} ${!isValid && styles.disabled}`}
          disabled={!isValid}
          type={"submit"}
        >
          {t("payCard")}
        </Button>
      </div>
    </form>
  );
};
