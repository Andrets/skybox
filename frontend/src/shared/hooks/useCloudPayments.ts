import { useState } from "react";

export const useCloudPayments = () => {
  const { tiptop } = window;
  const [checkout] = useState(
    new tiptop.Checkout({
      publicId: "pk_b7bdec8e9c868a7dcd34d04fb3c3d",
    })
  );
  return checkout;
};
