import { useLayoutEffect } from "react";
import { styleRootPreventScroll } from "../helpers/rootPreventScroll";

const useBlockScroll = (active: boolean) => {
  useLayoutEffect(styleRootPreventScroll, []);
};

export default useBlockScroll;
