declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;
  export default ReactComponent;
}

interface CustomSliderEventDetail {
  value: number | number[];
}

declare global {
  interface WindowEventMap {
    sliderUserChangeEvent: CustomEvent<CustomSliderEventDetail>;
  }
}
