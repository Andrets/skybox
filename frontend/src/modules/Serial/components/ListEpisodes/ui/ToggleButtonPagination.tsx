import { ToggleButton } from "@mui/material";
import { FC } from "react";
import {} from "../model/EpisodeListButtonProps";
import styles from "./styles.module.scss";
import { EpisodeButtonPagProps } from "../model/EpisodeListButtonPagProps";
const ToggleButtonPagination: FC<EpisodeButtonPagProps> = ({
  children,
  isActive,
  value,
  onClick,
  className,
}) => {
  return (
    <ToggleButton
      onClick={onClick}
      value={value}
      className={`${styles.toggleBtn} ${
        isActive && styles.active
      } ${className}`}
    >
      {children}
    </ToggleButton>
  );
};

export default ToggleButtonPagination;
