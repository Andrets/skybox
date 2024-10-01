import { HTMLAttributes, useContext } from "react";
import styles from "./styles.module.scss";
import {
  CVVCardInput,
  DateCardInput,
  NumberCardInput,
  // SaveCardCheckbox,
} from "./components";
import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";
import { Controller } from "react-hook-form";

export const AddCardForm = ({
  className,
  onSubmit,
  children,
  ...restProps
}: HTMLAttributes<HTMLFormElement>) => {
  const {
    numberCardRef,
    dateCardRef,
    cvvCardRef,
    formHook: {
      control,
      formState: { errors },
    },
  } = useContext(AddCardContext);

  return (
    <form
      onChange={() => {}}
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(e);
      }}
      className={`${styles.form} ${className}`}
      {...restProps}
    >
      <div className={`container ${styles.formContainer}`}>
        <Controller
          name="number"
          control={control}
          render={({ field }) => (
            <NumberCardInput
              className={styles.input}
              {...field}
              ref={numberCardRef}
            >
              {errors.number && (
                <span className={styles.error}>
                  {`${errors.number.message}`}
                </span>
              )}
            </NumberCardInput>
          )}
          rules={{
            required: "Введите номер карты",

            pattern: {
              value: /^(\d{4}\s?){4}$/,
              message: "Неверный формат номера карты",
            },
          }}
        />

        <div className={styles.rowForm}>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DateCardInput
                {...field}
                className={styles.input}
                ref={dateCardRef}
                placeholder="Срок действия"
              >
                {errors.date?.message && (
                  <span
                    className={styles.error}
                  >{`${errors.date.message}`}</span>
                )}
              </DateCardInput>
            )}
            rules={{
              required: "Введите срок действия",
              minLength: { value: 5, message: "Неверный формат даты" },
            }}
          />
          <Controller
            name="cvv"
            control={control}
            render={({ field }) => (
              <CVVCardInput
                {...field}
                className={styles.input}
                ref={cvvCardRef}
              >
                {errors.cvv?.message && (
                  <span
                    className={styles.error}
                  >{`${errors.cvv.message}`}</span>
                )}
              </CVVCardInput>
            )}
            rules={{
              required: "Введите CVV",
              minLength: {
                value: 3,
                message: "Неверный формат cvv",
              },
            }}
          />
        </div>
      </div>

      {/* <div className="container">
        <SaveCardCheckbox />
      </div> */}

      {children}
    </form>
  );
};
