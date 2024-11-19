import {
  SubscriptionPlanObject,
  SubscriptionSubtype,
} from "@/shared/models/UserInfoApi";
import { Button, Drawer, DrawerProps } from "@mui/material";
import styles from "./styles.module.scss";
import { TypeSubscribeBanner } from "@/ui/TypeSubscribeBanner/TypeSubscribeBanner";
import { useTranslation } from "react-i18next";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { MouseEventHandler } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PriceResponseForSerial } from "@/shared/models/FilmInfoApi";

export interface SubsDrawerProps extends DrawerProps {
  data: SubscriptionPlanObject;
  serial_data: PriceResponseForSerial | undefined;
  closeClick: MouseEventHandler<HTMLButtonElement>;
}

export const SubsDrawer = ({
  data,
  open,
  serial_data,
  closeClick,
}: SubsDrawerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const clickBanner: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    navigate(`/paySubscribe?serial_id=${id}`);
  };
  return (
    <Drawer className={styles.container} open={open} anchor="bottom">
      <div className={styles.buttonCont}>
        <Button onClick={closeClick} className={styles.closeBtn}>
          <CloseRoundedIcon />
        </Button>
      </div>

      {data[SubscriptionSubtype.TEMPORARILY_WEEK] && (
        <TypeSubscribeBanner
          onClick={clickBanner}
          className={styles.subItem}
          header={t("weeklySubscription")}
          description={t("subscribeServiceWeekDescription")}
          price={
            <span>
              {data[SubscriptionSubtype.TEMPORARILY_WEEK].price_in_rubles}₽{" "}
              <span>/ {t("week")}</span>
            </span>
          }
          isActive={false}
        />
      )}
      {data[SubscriptionSubtype.TEMPORARILY_MONTH] && (
        <TypeSubscribeBanner
          onClick={clickBanner}
          className={styles.subItem}
          header={t("monthlySubscription")}
          description={t("subscribeServiceMonthDescription")}
          price={
            <span>
              {data[SubscriptionSubtype.TEMPORARILY_MONTH].price_in_rubles}₽{" "}
              <span>/ {t("month")}</span>
            </span>
          }
          isActive={false}
        />
      )}

      {data[SubscriptionSubtype.TEMPORARILY_YEAR] && (
        <TypeSubscribeBanner
          onClick={clickBanner}
          className={styles.subItem}
          header={t("annualSubscription")}
          description={t("subscribeServiceYearDescription")}
          price={
            <span>
              {data[SubscriptionSubtype.TEMPORARILY_YEAR].price_in_rubles} ₽{" "}
              <span>/ {t("year")}</span>
            </span>
          }
          isActive={false}
        />
      )}

      {serial_data && (
        <TypeSubscribeBanner
          onClick={clickBanner}
          className={styles.subItem}
          header={t('buySerial')}
          description={t("ininfinitySerialAccess")}
          price={
            <span>
              {serial_data.price_in_rubles}₽ <span>/ {t("month")}</span>
            </span>
          }
          isActive={false}
        />
      )}
    </Drawer>
  );
};
