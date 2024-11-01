import { AddCardForm } from "@/reusable-in-pages/components/AddCard";

import starIMG from "@images/star.png";
import { Button } from "@mui/material";

import styles from "./styles.module.scss";
import { ReactComponent as ArrowRight } from "@icons/ArrowRight.svg";
import { useTelegram } from "@/shared/hooks/useTelegram";
import {
  useCheckTokenStatusTGStarsForSerialMutation,
  useCheckTokenStatusTGStarsMutation,
  useCreateTGStarsPaymentForSerialMutation,
  useCreateTGStarsPaymentMutation,
} from "@/api/userApi";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import {
  isSubscriptionSubtype,
  SubscriptionSubtype,
  TGStarsPaymentResponse,
} from "@/shared/models/UserInfoApi";
import { useNavigate } from "react-router-dom";
import { filmInfoApiSlice } from "@/api/FilmInfoApi";

export const SelectPayment = () => {
  const dispatch = useAppDispatch();
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const [createTGStarsPayment] = useCreateTGStarsPaymentMutation();
  const [createTGStarsPaymentForSerial] =
    useCreateTGStarsPaymentForSerialMutation();
  const [checkSerialToken] = useCheckTokenStatusTGStarsForSerialMutation();
  const [checkSubToken] = useCheckTokenStatusTGStarsMutation();
  const subType = useAppSelector((state) => state.paySubscribe.type_subscribe);

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
  return (
    <div className={styles.container}>
      <AddCardForm className={styles.cardForm} />
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
    </div>
  );
};
