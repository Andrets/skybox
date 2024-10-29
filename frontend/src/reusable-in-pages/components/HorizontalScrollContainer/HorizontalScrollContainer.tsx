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
  }, [children]);

  useEffect(() => {
    const checkSize = () => {
      if (containerRef && containerRef.current) {
        containerRef.current.style.height = `${
          contentRef?.current ? contentRef.current.clientHeight : 0
        }px`;
      }
    };
    const resizeWindow = () => {
      checkSize();
    };

    window.addEventListener("resize", resizeWindow);

    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, [children]);

  const handleResize = (entries: ResizeObserverEntry[]) => {
    const entry = entries[0];
    if (entry) {
      if (containerRef && containerRef.current) {
        containerRef.current.style.height = `${entry.contentRect.height}px`;
      }

    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [contentRef.current]);

  return (
    <div
      ref={containerRef}
      className={`${styles.scrollContainer} ${className} scrollContainer`}
    >
      <div ref={contentRef} className={`${styles.content} ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default HorizontalScrollContainer;
