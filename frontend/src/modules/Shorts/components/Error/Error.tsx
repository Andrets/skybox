import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import styles from "./styles.module.scss";
import { SerializedError } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";

export const ErrorShorts = ({
  error,
}: {
  error: FetchBaseQueryError | SerializedError;
}) => {
  const { t } = useTranslation();
  if ("status" in error && error.status === 404) {
    return <div className={styles.container}>{t("clipsNotFound")}!</div>;
  }

  return <></>;
};
