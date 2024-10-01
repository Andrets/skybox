import { ButtonProps } from "@mui/material";

export interface OptionLanguageProps extends ButtonProps {
  isActive?: boolean;
  title: string;
  subtitle: string;
}
