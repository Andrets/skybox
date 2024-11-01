import { AddCardForm } from "@/reusable-in-pages/components/AddCard";

import starIMG from "@images/star.png";
import { Button } from "@mui/material";

import styles from "./styles.module.scss";
import { ReactComponent as ArrowRight } from "@icons/ArrowRight.svg";
import { useTelegram } from "@/shared/hooks/useTelegram";
import { useCreateTGStarsPaymentMutation } from "@/api/userApi";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { isSubscriptionSubtype } from "@/shared/models/UserInfoApi";
import { useNavigate } from "react-router-dom";

export const SelectPayment = () => {
  const { webApp } = useTelegram();
  const navigate = useNavigate();
  const [createTGStarsPayment] = useCreateTGStarsPaymentMutation();
  const subType = useAppSelector((state) => state.paySubscribe.type_subscribe);
  const handleTGStars = () => {
    const func = async () => {
      if (isSubscriptionSubtype(subType)) {
        const response = await createTGStarsPayment(subType);
        const { data } = response;
        if (data) {
          webApp.openInvoice(data?.payment_link, (data: unknown) => {
            if (data === "paid") {
              navigate("/successPayment");
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
