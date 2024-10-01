import { useEffect } from "react";
export const useSetContainerHeight = (
  isOpen: boolean,
  setHeight: React.Dispatch<React.SetStateAction<number>>,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      if (isOpen) {
        setHeight(container.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isOpen]);
};

export const useSetHeightResizeWindow = (
  isOpen: boolean,
  contentRef: React.RefObject<HTMLDivElement>,
  setHeight: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    const resizeWindow = () => {
      const container = contentRef.current;
      if (container && isOpen) {
        setHeight(container.scrollHeight);
      }
    };

    window.addEventListener("resize", resizeWindow);

    return () => window.removeEventListener("resize", resizeWindow);
  }, [isOpen]);
};
