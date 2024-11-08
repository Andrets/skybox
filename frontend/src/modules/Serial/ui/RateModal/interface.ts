import { ModalProps, RatingProps } from "@mui/material";

export interface RateModalProps
  extends Omit<ModalProps, "onChange" | "children">,
    Pick<RatingProps, "onChange"> {}
