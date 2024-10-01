import { forwardRef } from "react";
import { AddCardInput } from "../../ui";
export const DateCardInput = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ className, ...restProps }, ref) => {
  return (
    <AddCardInput
      ref={ref}
      type="tel"
      className={className}
      placeholder="ММ/ГГ"
      maxLength={5}
      {...restProps}
    />
  );
});
