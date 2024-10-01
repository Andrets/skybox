import { ButtonProps } from "@mui/material";
import React from "react";

export interface SelectPaymentItemProps extends ButtonProps {
  icon: React.ReactNode;
  isActive: boolean;
  titleText: React.ReactNode;
  subtitleText: React.ReactNode;
}
