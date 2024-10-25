import { PaySubscribe } from "@/modules/PaySubscribe/PaySubscribe";
import { AddCardProvider } from "@/reusable-in-pages/contexts/AddCardContext/provider";

export const PaySubscribePage = () => {
  return (
    <AddCardProvider>
      <PaySubscribe />
    </AddCardProvider>
  );
};
