import { BaseComponentInterface } from "@/shared/models/BaseComponentInterfaces";
import styles from "./styles.module.scss";
import { FC } from "react";
const StandartMark: FC<BaseComponentInterface> = ({ className, children }) => {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
};

export default StandartMark;
