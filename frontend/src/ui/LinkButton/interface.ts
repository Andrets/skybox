import { HTMLAttributes } from "react";

export interface LinkButtonProps extends HTMLAttributes<HTMLElement> {
  name: React.ReactNode | string;
}
