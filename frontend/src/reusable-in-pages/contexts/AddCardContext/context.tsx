import { HookFormModel } from "@/reusable-in-pages/components/AddCard/models/HookFormModel";
import { createContext } from "react";
import { UseFormReturn } from "react-hook-form";

export interface AddCardContextModel {
  numberCardRef: React.RefObject<HTMLInputElement>;
  dateCardRef: React.RefObject<HTMLInputElement>;
  cvvCardRef: React.RefObject<HTMLInputElement>;
  saveCardCheckboxRef: React.RefObject<HTMLInputElement>;
  formHook: UseFormReturn<HookFormModel, unknown, undefined>;
}

export const AddCardContext = createContext<AddCardContextModel>(null!);
