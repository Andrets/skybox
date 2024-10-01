import { MutableRefObject, RefObject } from "react";

export interface BaseComponentInterface {
  className?: string;
  style?: React.CSSProperties;
  ref?: RefObject<HTMLElement> | MutableRefObject<HTMLElement>;
  children?: React.ReactNode;
}

export interface BaseComponentButtonInterface extends BaseComponentInterface {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface SVGIcons extends BaseComponentInterface {
  width?: number;
  height?: number;
  fill?: string;
}
