import { forwardRef } from "react";
import { AddCardInput } from "../../ui";

export const CVVCardInput = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ className, ...restProps }, ref) => {
  return (
    <AddCardInput
      {...restProps}
      ref={ref}
      className={className}
      maxLength={4}
      type="tel"
      placeholder="CVC/CVV"
    />
  );
});
