import { useLayoutEffect } from "react";
import { styleRootPreventScroll } from "../helpers/rootPreventScroll";

const useBlockScroll = () => {
  useLayoutEffect(styleRootPreventScroll, []);
};

export default useBlockScroll;
