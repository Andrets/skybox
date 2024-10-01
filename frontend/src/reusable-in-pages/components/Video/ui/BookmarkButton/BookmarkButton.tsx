import { FC } from "react";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
import { ReactComponent as BookmarkSVG } from "@icons/Bookmark.svg";
import { BookmarkButtonProps } from "../../models/ButtonModels";
export const BookmarkButton: FC<BookmarkButtonProps> = ({
  onClick,
  className,
  isActive,
  children,
  ...restProps
}) => {
  return (
    <Button
      {...restProps}
      sx={{ minWidth: 0, flexDirection: "column", padding: "12px" }}
      onClick={onClick}
      className={`${styles.sideBtn} ${className} `}
    >
      <BookmarkSVG className={`${isActive && styles.activeBookmarkSVG}`} />
      <span className={styles.text}>{children}</span>
    </Button>
  );
};
