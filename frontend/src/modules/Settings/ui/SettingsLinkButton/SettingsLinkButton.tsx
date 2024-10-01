import { Link } from "react-router-dom";
import styles from "./styles.module.scss";
import { SettingsLinkButtonProps } from "../../models/SettingsLinkButton";

export const SettingsLinkButton = ({
  children,
  to,
  name,
  className,
}: SettingsLinkButtonProps) => {
  return (
    <Link className={`${styles.link} ${className}`} to={to}>
      <span className={styles.name}>{name}</span> {children}
    </Link>
  );
};
