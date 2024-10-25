import { HTMLAttributes, useState } from "react";
import ShortsListContext from "./context";
export const ShortsListProvider = ({
  children,
}: Pick<HTMLAttributes<HTMLElement>, "children">) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [slideIgnoreTouches, setSlideIgnoreTouches] = useState(false);

  return (
    <ShortsListContext.Provider
      value={{
        activeSlideIndex,
        setActiveSlideIndex,
        slideIgnoreTouches,
        setSlideIgnoreTouches,
      }}
    >
      {children}
    </ShortsListContext.Provider>
  );
};
