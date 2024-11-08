import { DrawerProps } from "@mui/material";
import { MouseEventHandler } from "react";

export interface CommentsModalProps extends DrawerProps {
  onCloseClickBtn: MouseEventHandler<HTMLButtonElement>;
}
