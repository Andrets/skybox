import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";
import { useCloudPayments } from "@/shared/hooks/useCloudPayments";
import { useContext } from "react";

export const useGetToken = () => {
  const {
    formHook: {
      getValues,
      formState: { isValid },
    },
  } = useContext(AddCardContext);

  const checkout = useCloudPayments();

  const getToken = async () => {
    if (
      getValues()?.number &&
      getValues()?.cvv &&
      getValues()?.date &&
      isValid
    ) {
      let response = await checkout.createPaymentCryptogram({
        cardNumber: getValues().number,
        cvv: getValues().cvv,
        expDateMonth: getValues().date.split("/")[0],
        expDateYear: getValues().date.split("/")[1],
      });

      return response;
    }
  };

  return getToken;
};
