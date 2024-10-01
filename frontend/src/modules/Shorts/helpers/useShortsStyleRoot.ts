import { useEffect } from "react";

export const useShortsStyleRoot = () => {
  useEffect(() => {
    const root = document.getElementById("root");

    if (root) {
      root.style.height = "calc(100vh - 88px)";
    }

    return () => {
      const root = document.getElementById("root");

      if (root) {
        root.style.height = "";
      }
    };
  }, []);
};
