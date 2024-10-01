import { FC } from "react";
import styles from "./styles.module.scss";
import { VideoInterfaceProps } from "./interface";

export const Video: FC<VideoInterfaceProps> = ({
  videoRef,
  className,
  children,
  onClick,
  ...restProps
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <video ref={videoRef} onClick={onClick} {...restProps} playsInline />
      {children}
    </div>
  );
};
