import { useTranslation } from "react-i18next";
import { TypeSubscribeBanner } from "../../ui/TypeSubscribeBanner/TypeSubscribeBanner";
import styles from "./styles.module.scss";
export const SelectSubscribe = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <TypeSubscribeBanner
        className={styles.subItem}
        header={t("annualSubscription")}
        description={t("subscribeServiceMonthDescription")}
        price={
          <span>
            300 ₽ <span>/ {t("month")}</span>
          </span>
        }
        isActive={false}
      />

      <TypeSubscribeBanner
        className={styles.subItem}
        header={t("monthlySubscription")}
        description={t("subscribeServiceYearDescription")}
        price={
          <span>
            3500 ₽ <span>{t("year")}</span>
          </span>
        }
        isActive={true}
      />
    </div>
  );
};
