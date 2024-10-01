import { useRef } from "react";
import styles from "./styles.module.scss";
import { useEffect } from "react";
import { HorizontalScrollContainerProps } from "./interface";

const HorizontalScrollContainer = ({
  className,
  contentClassName,
  children,
}: HorizontalScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef && containerRef.current) {
      containerRef.current.style.height = `${
        contentRef?.current ? contentRef.current.clientHeight : 0
      }px`;
    }
  }, [containerRef.current, contentRef.current, children]);
  return (
    <div
      ref={containerRef}
      className={`${styles.scrollContainer} ${className}`}
    >
      <div ref={contentRef} className={`${styles.content} ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default HorizontalScrollContainer;
