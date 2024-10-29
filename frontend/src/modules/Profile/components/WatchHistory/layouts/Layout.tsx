import { SectionHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { HTMLAttributes } from "react";
export const WatchHistoryLayout = ({
  children,
}: HTMLAttributes<HTMLElement>) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={`container ${styles.container}`}>
        <SectionHeader className={styles.header}>
          {t("watchHistory")}
        </SectionHeader>
      </div>

      {children}
    </>
  );
};
