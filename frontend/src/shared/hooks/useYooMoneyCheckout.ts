import { useAuthorizationQuery } from "@/api/userApi";
import { useEffect, useState } from "react";

export const useYooMoneyCheckout = () => {
  const [checkout, setCheckout] = useState(
    window.YooMoneyCheckout("465363", { language: "ru" })
  );
  const { data } = useAuthorizationQuery();

  useEffect(() => {
    if (data?.lang) {
      setCheckout(
        window.YooMoneyCheckout("465363", {
          language: data.lang === "en" ? "en" : "ru",
        })
      );
    }
  }, [data]);

  return checkout;
};
