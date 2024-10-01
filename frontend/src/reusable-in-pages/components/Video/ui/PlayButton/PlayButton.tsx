import { Button } from "@mui/material";
import { FC } from "react";
import styles from "./styles.module.scss";
import { ReactComponent as PlaySVG } from "@icons/Play.svg";
import { ReactComponent as PauseSVG } from "@icons/Pause.svg";
import { PlayButtonProps } from "../../models/ButtonModels";
export const PlayButton: FC<PlayButtonProps> = ({
  isPlay,
  className,
  ...restProps
}) => {
  return (
    <Button
      {...restProps}
      sx={{ background: "var(--main-theme-color-1)", borderRadius: "50%" }}
      className={`${styles.playBtn} ${className}`}
    >
      {isPlay ? <PauseSVG /> : <PlaySVG className={styles.playSVG} />}
    </Button>
  );
};
