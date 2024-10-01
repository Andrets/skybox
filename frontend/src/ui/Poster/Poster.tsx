import { Img } from "react-image";
import styles from "./styles.module.scss";
import { FC } from "react";
import { PosterProps } from "./interface";
import LoaderSkeletonImage from "@/ui/LoaderSkeletonImage/LoaderSkeletonImage";
const Poster: FC<PosterProps> = ({ poster, className, children }) => {
  return (
    <div className={`${styles.poster} ${className}`}>
      <Img loading="lazy" src={poster} loader={<LoaderSkeletonImage />} />

      {children}
    </div>
  );
};

export default Poster;
