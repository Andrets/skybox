import { Button } from "@mui/material";
import { FC } from "react";
import styles from "./styles.module.scss";
import { ExploreItemProps } from "./interface";
export const ExploreItem: FC<ExploreItemProps> = ({
  onClick,
  exploreValue,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      variant="text"
      className={`${styles.button} ${className}`}
    >
      {exploreValue}
    </Button>
  );
};


