import { FC } from "react";
import styles from "./styles.module.scss";
import { VideoInterfaceProps } from "./interface";

export const Video: FC<VideoInterfaceProps> = ({
  videoRef,
  className,
  children,
  onClick,
  onClickContainer,
  ...restProps
}) => {
  return (
    <div
      onClick={onClickContainer}
      className={`${styles.container} ${className}`}
    >
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
      
        {...restProps}
        playsInline
      />
      {children}
    </div>
  );
};
