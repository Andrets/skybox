import { ButtonProps } from "@mui/material";
import React from "react";

export interface TypeSubscribeBannerModel extends ButtonProps {
  header: React.ReactNode;
  price: React.ReactNode;
  description: React.ReactNode;
  isActive: boolean;
}
