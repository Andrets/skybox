import { ButtonProps } from "@mui/material";

export interface BookmarkButtonProps extends ButtonProps {
  isActive?: boolean;
}

export interface PlayButtonProps extends ButtonProps {
  isPlay: boolean;
}
