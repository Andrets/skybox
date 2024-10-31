import { SelectPayment, SelectSubscribe } from "./components";
import { Button } from "@mui/material";
import styles from "./styles.module.scss";
import { useContext, useState } from "react";
import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";
import { useTranslation } from "react-i18next";
import { useGetToken } from "./helpers/useGetToken";
import useBackButton from "@/shared/hooks/useBackButton";
import { YooMoneyCheckoutErrorList } from "@/shared/constants/constants";
import { ReactComponent as LoaderSpinner } from "@icons/Loader.svg";
import {
  useCreatePaymentForSerialMutation,
  useCreatePaymentMutation,
} from "@/api/userApi";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { useNavigate } from "react-router-dom";
import { SubscriptionSubtype } from "@/shared/models/UserInfoApi";
export const PaySubscribe = () => {
  useBackButton();
  const searchParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const subType = useAppSelector((state) => state.paySubscribe.type_subscribe);

  const [createPaymentQuery] = useCreatePaymentMutation();
  const [createPaymentSerial] = useCreatePaymentForSerialMutation();
  const {
    formHook: {
      formState: { isValid },
      setError,
    },
  } = useContext(AddCardContext);

  const { t } = useTranslation();

  const getToken = useGetToken();

  const paymentFunc = async () => {
    const resp = await getToken();

    if (resp?.data) {
      setLoading(true);
      if (
        subType === SubscriptionSubtype.TEMPORARILY_MONTH ||
        subType === SubscriptionSubtype.TEMPORARILY_WEEK ||
        subType === SubscriptionSubtype.TEMPORARILY_YEAR
      ) {
        const paymentInfo = await createPaymentQuery({
          paymentToken: resp.data.response.paymentToken,
          subType: subType,
        });

        if (paymentInfo && paymentInfo?.data) {
          if (paymentInfo?.data.status === "succeeded") {
            navigate("/successPayment");
          }
        }
      } else {
        const serial_id = searchParams.get("serial_id");
        if (serial_id) {
          const paymentInfo = await createPaymentSerial({
            paymentToken: resp.data.response.paymentToken,
            serial_id: serial_id,
          });

          if (paymentInfo && paymentInfo?.data) {
            if (paymentInfo?.data.status === "succeeded") {
              navigate("/successPayment");
            }
          }
        }
      }
    }

    if (resp?.error) {
      let params = resp.error.params;

      for (let i = 0; i < params.length; i++) {
        let el = params[i];

        if (el.code === YooMoneyCheckoutErrorList.invalid_number) {
          setError("number", { type: "value", message: el.message });
        }

        if (el.code === YooMoneyCheckoutErrorList.invalid_cvc) {
          setError("cvv", { type: "value", message: el.message });
        }

        if (el.code === YooMoneyCheckoutErrorList.invalid_expiry_month) {
          setError("date", { type: "value", message: el.message });
        }

        if (el.code === YooMoneyCheckoutErrorList.invalid_expiry_year) {
          setError("date", { type: "value", message: el.message });
        }
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        paymentFunc();
      }}
      className={`container ${styles.form}`}
    >
      <SelectSubscribe />

      <SelectPayment />

      <div className={styles.payBtnCont}>
        <Button
          className={`${styles.payBtn} ${
            (!isValid || loading) && styles.disabled
          }`}
          disabled={!isValid || loading}
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
