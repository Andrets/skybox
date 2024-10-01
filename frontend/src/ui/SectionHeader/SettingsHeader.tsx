import { HTMLAttributes } from "react";
import styles from "./styles.module.scss";

export const SettingsHeader = ({
  children,
  className,
}: HTMLAttributes<HTMLElement>) => {
  return (
    <header className={`${styles.settingsHeader} ${className}`}>
      {children}
    </header>
  );
};
