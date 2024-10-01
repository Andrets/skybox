import { AddCardForm } from "@/reusable-in-pages/components/AddCard";
import { FooterInfo } from "./components";
import { Button } from "@mui/material";
import styles from "./styles.module.scss";
import { useContext } from "react";
import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";

export const AddCard = () => {
  const {
    formHook: {
      formState: { isValid },
    },
  } = useContext(AddCardContext);
  return (
    <AddCardForm className={styles.form}>
      <FooterInfo />

      <div className="container">
        <Button disabled={!isValid} className={styles.submitBtn} type="submit">
          Добавить карту
        </Button>
      </div>
    </AddCardForm>
  );
};
