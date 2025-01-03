import {
  SubscriptionPlanObject,
  SubscriptionSubtype,
} from "@/shared/models/UserInfoApi";
import { TypeSubscribeBanner } from "@/ui/TypeSubscribeBanner/TypeSubscribeBanner";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { setTypeSubscribe } from "@/modules/PaySubscribe/slices/slice";

export const ServiceSubList = ({ data }: { data: SubscriptionPlanObject }) => {
  const { t } = useTranslation();
  const typeSub = useAppSelector((state) => state.paySubscribe.type_subscribe);
  const dispatch = useAppDispatch();
  const handleType = (el: SubscriptionSubtype) => () => {
    dispatch(setTypeSubscribe(el));
  };


  return (
    <>
      
      {data[SubscriptionSubtype.TEMPORARILY_WEEK] && (
        <TypeSubscribeBanner
          onClick={handleType(SubscriptionSubtype.TEMPORARILY_WEEK)}
          className={styles.subItem}
          header={t("weeklySubscription")}
          description={t("subscribeServiceWeekDescription")}
          price={
            <span>
              {data[SubscriptionSubtype.TEMPORARILY_WEEK].price_in_rubles}₽{" "}
              <span>/ {t("week")}</span>
            </span>
          }
          isActive={typeSub === SubscriptionSubtype.TEMPORARILY_WEEK}
        />
      )}
      {data[SubscriptionSubtype.TEMPORARILY_MONTH] && (
        <TypeSubscribeBanner
          className={styles.subItem}
          onClick={handleType(SubscriptionSubtype.TEMPORARILY_MONTH)}
          header={t("monthlySubscription")}
          description={t("subscribeServiceMonthDescription")}
          price={
            <span>
              {data[SubscriptionSubtype.TEMPORARILY_MONTH].price_in_rubles}₽{" "}
              <span>/ {t("month")}</span>
            </span>
          }
          isActive={typeSub === SubscriptionSubtype.TEMPORARILY_MONTH}
        />
      )}

      {data[SubscriptionSubtype.TEMPORARILY_YEAR] && (
        <TypeSubscribeBanner
          className={styles.subItem}
          onClick={handleType(SubscriptionSubtype.TEMPORARILY_YEAR)}
          header={t("annualSubscription")}
          description={t("subscribeServiceYearDescription")}
          price={
            <span>
              {data[SubscriptionSubtype.TEMPORARILY_YEAR].price_in_rubles} ₽{" "}
              <span>/ {t("year")}</span>
            </span>
          }
          isActive={typeSub === SubscriptionSubtype.TEMPORARILY_YEAR}
        />
      )}
    </>
  );
};
