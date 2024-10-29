import { useAuthorizationQuery } from "@/api/userApi";
import { useEffect, useState } from "react";

export const useYooMoneyCheckout = () => {
  const [checkout, setCheckout] = useState(
    window.YooMoneyCheckout(import.meta.env.VITE_SHOP_ID, { language: "ru" })
  );
  const { data } = useAuthorizationQuery();

  useEffect(() => {
    if (data?.lang) {
      setCheckout(
        window.YooMoneyCheckout(import.meta.env.VITE_SHOP_ID, {
          language: data.lang === "en" ? "en" : "ru",
        })
      );
    }
  }, [data]);

  return checkout;
};
