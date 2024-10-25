import { SectionHeader } from "@/ui/SectionHeader";
import React from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

export const Layout = ({
  children,
  childContainerClassName,
}: {
  children?: React.ReactNode;
  childContainerClassName?: string;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <SectionHeader className={`${styles.header} ${styles.section} container`}>
        {t("results")}
      </SectionHeader>

      <div className={`${styles.childContainer} ${childContainerClassName}`}>
        {children}
      </div>
    </>
  );
};
