import { SelectSubscribe } from "./components";
import { Button } from "@mui/material";
import styles from "./styles.module.scss";
import { useContext, useEffect, useState } from "react";
import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";
import { useTranslation } from "react-i18next";
import useBackButton from "@/shared/hooks/useBackButton";
import { ReactComponent as LoaderSpinner } from "@icons/Loader.svg";
import {
  useCreatePaymentForSerialMutation,
  useCreatePaymentMutation,
} from "@/api/userApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { useNavigate } from "react-router-dom";
import { SubscriptionSubtype } from "@/shared/models/UserInfoApi";
import { filmInfoApiSlice } from "@/api/FilmInfoApi";
export const PaySubscribe = () => {
  useBackButton();
  const searchParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const subType = useAppSelector((state) => state.paySubscribe.type_subscribe);

  const [createPaymentQuery] = useCreatePaymentMutation();
  const [createPaymentSerial] = useCreatePaymentForSerialMutation();
  const {
    formHook: {
      formState: { isValid },
      reset,
    },
  } = useContext(AddCardContext);

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
      const { link, status } = paymentInfo.data;
      const { link, status } = paymentInfo.data;
      if (link) {
        navigate("/dmca");
        window.location.href = link;
      } else if (status === "succeed") {
        dispatch(filmInfoApiSlice.util.invalidateTags(["Pay"]));
        navigate("/successPayment");
        reset();
      }
    } else {
      const serial_id = searchParams.get("serial_id");
      if (serial_id) {
        const paymentInfo = await createPaymentSerial({
          paymentToken: "someToken", // или замените на реальное значение
          serial_id: serial_id,
        });

        if (paymentInfo && paymentInfo?.data) {
          if (paymentInfo?.data.status === "succeed") {
            dispatch(filmInfoApiSlice.util.invalidateTags(["Pay"]));
            navigate("/successPayment");
            reset();
          }
        }
      }
    }
  }


 /*  const paymentFunc = async () => {
    try {
      const resp = await getToken();
      if (typeof resp === "string") {
        setLoading(true);
        if (
          subType === SubscriptionSubtype.TEMPORARILY_MONTH ||
          subType === SubscriptionSubtype.TEMPORARILY_WEEK ||
          subType === SubscriptionSubtype.TEMPORARILY_YEAR
        ) {
          const paymentInfo = await createPaymentQuery({
            paymentToken: String(resp),
            subType: subType,
          });

          if (paymentInfo && paymentInfo?.data) {
            if (paymentInfo?.data.status === "succeed") {
              dispatch(filmInfoApiSlice.util.invalidateTags(["Pay"]));
              navigate("/successPayment");
              reset();
            }
          }
        } else {
          const serial_id = searchParams.get("serial_id");
          if (serial_id) {
            const paymentInfo = await createPaymentSerial({
              paymentToken: resp,
              serial_id: serial_id,
            });

            if (paymentInfo && paymentInfo?.data) {
              if (paymentInfo?.data.status === "succeed") {
                dispatch(filmInfoApiSlice.util.invalidateTags(["Pay"]));
                navigate("/successPayment");
                reset();
              }
            }
          }
        }
      }
    } catch (e: any) {
      if (e?.cardNumber) {
        setError("number", {
          type: "value",
          message: t("error.validateCardNumber"),
        });
      }
    }
  }; */

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
