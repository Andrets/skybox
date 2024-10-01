import { BaseComponentInterface } from "@/shared/models/BaseComponentInterfaces";
import { FC } from "react";
import styles from "./styles.module.scss";
export const SectionHeader: FC<BaseComponentInterface> = ({ children, className }) => {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
};

