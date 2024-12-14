import { SelectSubscribe } from "./components";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import useBackButton from "@/shared/hooks/useBackButton";
import { ReactComponent as LoaderSpinner } from "@icons/Loader.svg";
import {
  useCheckTokenStatusTGStarsForSerialMutation,
  useCheckTokenStatusTGStarsMutation,
  useCreatePaymentForSerialMutation,
  useCreatePaymentMutation,
  useCreateTGStarsPaymentForSerialMutation,
  useCreateTGStarsPaymentMutation,
} from "@/api/userApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { Link, useNavigate } from "react-router-dom";
import {
  isSubscriptionSubtype,
  SubscriptionSubtype,
  TGStarsPaymentResponse,
} from "@/shared/models/UserInfoApi";
import { useTelegram } from "@/shared/hooks/useTelegram";
import { filmInfoApiSlice } from "@/api/FilmInfoApi";
import starIMG from "@images/star.png";
import {ReactComponent as ArrowRight} from "@icons/ArrowRight.svg"

export const PaySubscribe = () => {
  useBackButton();
  const searchParams = new URLSearchParams(window.location.search);
  const [loading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const dispatch = useAppDispatch();
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const subType = useAppSelector((state) => state.paySubscribe.type_subscribe);

  const [createPaymentQuery] = useCreatePaymentMutation();
  const [createPaymentSerial] = useCreatePaymentForSerialMutation();

  const [createTGStarsPayment] = useCreateTGStarsPaymentMutation();
  const [createTGStarsPaymentForSerial] =
    useCreateTGStarsPaymentForSerialMutation();
  const [checkSerialToken] = useCheckTokenStatusTGStarsForSerialMutation();
  const [checkSubToken] = useCheckTokenStatusTGStarsMutation();

  const checkTokenSerialFunc = async (data: TGStarsPaymentResponse) => {
    const checkToken = await checkSerialToken({
      serial_id: subType,
      payloadToken: String(data.payload_token),
    });

    if (checkToken?.data?.is_paid) {
      navigate("/successPayment");
      dispatch(filmInfoApiSlice.util.invalidateTags(["Pay"]));
    }
  };

  const checkTokenSubFunc = async (
    subType: SubscriptionSubtype,
    payloadToken: string
  ) => {
    const checkToken = await checkSubToken({
      subType: subType,
      payloadToken: payloadToken,
    });

    if (checkToken?.data?.is_paid) {
      navigate("/successPayment");
      dispatch(filmInfoApiSlice.util.invalidateTags(["Pay"]));
    }
  };

  const handleTGStars = () => {
    const func = async () => {
      if (isSubscriptionSubtype(subType)) {
        const response = await createTGStarsPayment(subType);
        const { data } = response;
        if (data) {
          webApp.openInvoice(data?.payment_link, (status: unknown) => {
            if (status === "paid") {
              checkTokenSubFunc(subType, String(data.payload_token));
            }
          });
        }
      } else {
        const response = await createTGStarsPaymentForSerial(subType);
        const { data } = response;
        if (data) {
          webApp.openInvoice(data?.payment_link, (status: unknown) => {
            if (status === "paid") {
              checkTokenSerialFunc(data);
            }
          });
        }
      }
    };

    func();
  };

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

      <Button
        className={styles.tgBtn}
        onClick={handleTGStars}
        sx={{
          maxHeight: undefined,
          maxWidth: undefined,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>
          <img width={24} height={24} src={starIMG} alt="" />{" "}
          <span>Telegram stars</span>
        </span>

        <ArrowRight />
      </Button>

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
