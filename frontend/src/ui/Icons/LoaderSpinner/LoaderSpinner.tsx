import { HTMLAttributes } from "react";
import styles from "./styles.module.scss";
export const LoaderSpinner = ({
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...restProps} className={`${styles["lds-ring"]} ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
