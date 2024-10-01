import { AddCard } from "@/modules/AddCart/AddCard";
import { AddCardProvider } from "@/reusable-in-pages/contexts/AddCardContext/provider";

export const AddCartPage = () => {
  return (
    <>
      <AddCardProvider>
        <AddCard />
      </AddCardProvider>
    </>
  );
};
