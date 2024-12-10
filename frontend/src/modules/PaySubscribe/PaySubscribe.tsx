import { SelectSubscribe } from "./components";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import useBackButton from "@/shared/hooks/useBackButton";
import { ReactComponent as LoaderSpinner } from "@icons/Loader.svg";
import {
  useCreatePaymentForSerialMutation,
  useCreatePaymentMutation,
} from "@/api/userApi";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { Link } from "react-router-dom";
import { SubscriptionSubtype } from "@/shared/models/UserInfoApi";

export const PaySubscribe = () => {
  useBackButton();
  const searchParams = new URLSearchParams(window.location.search);
  const [loading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const subType = useAppSelector((state) => state.paySubscribe.type_subscribe);

  const [createPaymentQuery] = useCreatePaymentMutation();
  const [createPaymentSerial] = useCreatePaymentForSerialMutation();

  const { t } = useTranslation();

  const paymentFunc = async () => {
    setLoading(true);
    if (
      subType === SubscriptionSubtype.TEMPORARILY_MONTH ||
      subType === SubscriptionSubtype.TEMPORARILY_WEEK ||
      subType === SubscriptionSubtype.TEMPORARILY_YEAR
    ) {
      const paymentInfo = await createPaymentQuery({
        subType: subType,
      });

      if (paymentInfo && paymentInfo?.data) {
        if (paymentInfo?.data.status === "succeed") {
          window.location.href = paymentInfo.data.link;
        }
      } else {
        const serial_id = searchParams.get("serial_id");
        if (serial_id) {
          const paymentInfo = await createPaymentSerial({
            serial_id: serial_id,
          });

          if (paymentInfo && paymentInfo?.data) {
            if (paymentInfo?.data.status === "succeed") {
              window.location.href = paymentInfo.data.link;
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        paymentFunc();
      }}
      className={`container ${styles.form}`}
    >
      <SelectSubscribe />

      <label className={styles.privacy}>
        <input
          checked={agreement}
          onClick={() => setAgreement(!agreement)}
          type="checkbox"
        />
        <span className={styles.checkboxMask}></span>

        <span className={`${styles.text}}`}>
          {t("privacyPolicyAggrement.mainText")}
          <Link to="/privacyPolicy">
            {" "}
            {t("privacyPolicyAggrement.linkText")}
          </Link>
        </span>
      </label>

      <div className={styles.payBtnCont}>
        <Button
          className={`${styles.payBtn} ${
            loading || (!agreement && styles.disabled)
          }`}
          disabled={loading || !agreement}
          type={"submit"}
        >
          <>
            {loading ? (
              <LoaderSpinner width={25} height={25} />
            ) : (
              <> {t("payCard")}</>
            )}
          </>
        </Button>
      </div>
    </form>
  );
};
