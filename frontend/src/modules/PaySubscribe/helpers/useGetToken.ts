import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";

import { useYooMoneyCheckout } from "@/shared/hooks/useYooMoneyCheckout";
import { useContext } from "react";

export const useGetToken = () => {
  const {
    formHook: {
      getValues,
      formState: { isValid },
    },
  } = useContext(AddCardContext);

  const checkout = useYooMoneyCheckout();

  const getToken = async () => {
    if (
      getValues()?.number &&
      getValues()?.cvv &&
      getValues()?.date &&
      isValid
    ) {
      let response = await checkout.tokenize({
        number: getValues().number.replace(/\s/g, ""),
        cvc: getValues().cvv,
        month: getValues().date.split("/")[0],
        year: getValues().date.split("/")[1],
      });

      return response;
    }
  };

  return getToken;
};
