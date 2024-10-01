import { useContext, useState } from "react";
import styles from "./styles.module.scss";
import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";
export const SaveCardCheckbox = () => {
  const { saveCardCheckboxRef } = useContext(AddCardContext);
  const [checked, setChecked] = useState(false);
  return (
    <div className={styles.container}>
      <span className={styles.text}>Сохранить карту для будущей оплаты</span>
      <label className={`${styles.toggler} ${checked && styles.active}`}>
        <input
          ref={saveCardCheckboxRef}
          type="checkbox"
          onChange={(e) => {
            const value = e.target.checked;
            if (saveCardCheckboxRef?.current) {
              saveCardCheckboxRef.current.checked = value;
              setChecked(value);
            }
          }}
        />

        <span
          className={`${styles.circle}  ${checked && styles.active}`}
        ></span>
      </label>
    </div>
  );
};
