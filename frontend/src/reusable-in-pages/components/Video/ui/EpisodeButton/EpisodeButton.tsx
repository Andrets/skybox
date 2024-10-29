import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";
import { ReactComponent as EpisodeSVG } from "@icons/Episodes.svg";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

export const EpisodeButton: FC<ButtonProps> = ({ className, ...restProps }) => {
  const { t } = useTranslation();
  return (
    <Button
      {...restProps}
      sx={{ minWidth: 0, flexDirection: "column", padding: "12px" }}
      className={`${styles.sideBtn} ${className}`}
    >
      <EpisodeSVG />
      <span>{t("episodes")}</span>
    </Button>
  );
};
