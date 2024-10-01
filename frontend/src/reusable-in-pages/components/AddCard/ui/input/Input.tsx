import styles from "./styles.module.scss";
import { forwardRef } from "react";
export const AddCardInput = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ className, children, ...restProps }, ref) => {
  return (
    <label className={`${styles.container} ${className}`}>
      <input className={styles.input} ref={ref} {...restProps} />
      {children}
    </label>
  );
});
