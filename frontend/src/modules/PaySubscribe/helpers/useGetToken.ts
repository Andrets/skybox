import { AddCardContext } from "@/reusable-in-pages/contexts/AddCardContext/context";
import { YooMoneyCheckoutErrorList } from "@/shared/constants/constants";
import { useYooMoneyCheckout } from "@/shared/hooks/useYooMoneyCheckout";
import { useContext } from "react";

export const useGetToken = () => {
  const {
    formHook: {
      getValues,
      formState: { isValid },
      setError,
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



      if (response?.data) {
      }

      if (response?.error) {
        let params = response.error.params;

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
    }
  };

  return getToken;
};
