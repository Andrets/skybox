import { EffectCallback } from "react";

export const styleRootPreventScroll: EffectCallback = () => {
  console.log('pizda')
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";

  const root = document.querySelector("#root");

  if (root) {
    root.classList.toggle("prevent-scroll");
  }

  return () => {
    document.body.style.height = "";
    document.body.style.overflow = "auto";
    console.log('huy')
    if (root) {
      root.classList.toggle("prevent-scroll");
    }
  };
};
