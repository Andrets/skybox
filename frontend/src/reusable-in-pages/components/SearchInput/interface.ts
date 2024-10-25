import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface SearchInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  className?: string;
  iconClassName?: string;
  inputClassName?: string;
}
