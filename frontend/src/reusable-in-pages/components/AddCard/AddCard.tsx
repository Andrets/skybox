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
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const AddCardForm = ({
  className,
  onSubmit,
  children,
  ...restProps
}: HTMLAttributes<HTMLDivElement>) => {
  const {
    numberCardRef,
    dateCardRef,
    cvvCardRef,
    formHook: {
      control,
      formState: { errors },
    },
  } = useContext(AddCardContext);

  const { t } = useTranslation();

  return (
    <div className={`${styles.form} ${className}`} {...restProps}>
      <div className={`${styles.formContainer}`}>
        <Controller
          name="number"
          control={control}
          render={({ field }) => {
            return (
              <NumberCardInput
                {...field}
                placeholder={t("cardNumber")}
                className={styles.input}
                ref={numberCardRef}
              >
                {errors.number && (
                  <span className={styles.error}>
                    {`${errors.number.message}`}
                  </span>
                )}
              </NumberCardInput>
            );
          }}
          rules={{
            required: t("error.cardNumberRequired"),
            pattern: {
              value: /^(\d{4}\s?){4}$/,
              message: t("error.cardNumberPattern"),
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
                placeholder={t("validityPeriod")}
              >
                {errors.date?.message && (
                  <span
                    className={styles.error}
                  >{`${errors.date.message}`}</span>
                )}
              </DateCardInput>
            )}
            rules={{
              required: t("error.dateRequired"),
              minLength: { value: 5, message: t("error.dateMinLength") },
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
              required: t("error.cvvRequired"),
              minLength: {
                value: 3,
                message: t("error.cvvMinLength"),
              },
            }}
          />
        </div>

        <Controller
          name="privacy"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            return (
              <label className={styles.privacy}>
                <input
                  {...field}
                  checked={field.value}
                  type="checkbox"
                  value={undefined}
                />
                <span className={styles.checkboxMask}></span>

                <span
                  className={`${styles.text} ${errors.privacy && styles.error}`}
                >
                  {t("privacyPolicyAggrement.mainText")}
                  <Link to="/privacyPolicy">
                    {" "}
                    {t("privacyPolicyAggrement.linkText")}
                  </Link>
                </span>
              </label>
            );
          }}
        />
      </div>

      {children}
    </div>
  );
};
