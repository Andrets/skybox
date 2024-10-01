import { BaseComponentInterface } from "@/shared/models/BaseComponentInterfaces";
import { FC } from "react";
import styles from "./styles.module.scss";
const AttentionMark: FC<BaseComponentInterface> = ({ children, className }) => {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
};

export default AttentionMark;
