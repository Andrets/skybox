import { useMask } from "@react-input/mask";
import { AddCardContext } from "./context";
import { useForm } from "react-hook-form";
import { HookFormModel } from "@/reusable-in-pages/components/AddCard/models/HookFormModel";
import { useRef } from "react";

interface AddCardProviderProps {
  children?: React.ReactNode;
}

export const AddCardProvider = ({ children }: AddCardProviderProps) => {
  const numberCardRef = useMask({
    mask: "____ ____ ____ ____",
    replacement: { _: /\d/ },
  });

  const dateCardRef = useMask({
    mask: "__/__",
    replacement: { _: /\d/ },
    onMask: (e) => {
      const str = e.detail.input;
      const part1 = str.substring(0, 2); // Получаем первые два символа
      const part2 = str.substring(2, 4); // Получаем вторые два символа

      let mask = "";

      let maskMonth = part1;

      if (Number(part1) > 12) {
        maskMonth = "12";
      }

      if (part1 === "00") {
        maskMonth = "01";
      }

      mask = `${maskMonth}${part2.length === 0 ? "" : `/${part2}`}`;

      if (dateCardRef?.current) {
        dateCardRef.current.value = mask;
      }
    },
  });

  const cvvCardRef = useMask({ replacement: { _: /\d/ }, mask: "____" });
  const formHook = useForm<HookFormModel, unknown>({ mode: "onTouched" });
  const saveCardCheckboxRef = useRef<HTMLInputElement>(null);
  return (
    <AddCardContext.Provider
      value={{
        numberCardRef,
        dateCardRef,
        cvvCardRef,
        formHook,
        saveCardCheckboxRef,
      }}
    >
      {children}
    </AddCardContext.Provider>
  );
};
