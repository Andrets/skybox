import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";
import { ReactComponent as EpisodeSVG } from "@icons/Episodes.svg";
import styles from "./styles.module.scss";

export const EpisodeButton: FC<ButtonProps> = ({ className, ...restProps }) => {
  return (
    <Button
      {...restProps}
      sx={{ minWidth: 0, flexDirection: "column", padding: "12px" }}
      className={`${styles.sideBtn} ${className}`}
    >
      <EpisodeSVG />
      <span>Episodes</span>
    </Button>
  );
};
