import { Img, useImage } from "react-image";
import styles from "./styles.module.scss";
import { FC, Suspense } from "react";
import { PosterProps } from "./interface";
import LoaderSkeletonImage from "@/ui/LoaderSkeletonImage/LoaderSkeletonImage";
import { ErrorBoundary } from "react-error-boundary";
const PosterComponent: FC<PosterProps> = ({ poster, className, children }) => {
  const { src } = useImage({ srcList: poster });

  return (
    <div className={`${styles.poster} ${className}`}>
      <Img
        loading="lazy"
        src={String(src)}
        loader={<LoaderSkeletonImage />}
      ></Img>

      {children}
    </div>
  );
};

const Poster = ({ poster, className, children }: PosterProps) => {
  return (
    <Suspense
      fallback={
        <div className={`${styles.poster} ${className}`}>
          <LoaderSkeletonImage className={styles.loaderSkeleton} />
          {children}
        </div>
      }
    >
      <ErrorBoundary
        fallbackRender={() => {
          return (
            <div className={`${styles.poster} ${className}`}>
              <LoaderSkeletonImage className={styles.loaderSkeleton} />
              {children}
            </div>
          );
        }}
      >
        <PosterComponent
          className={className}
          children={children}
          poster={poster}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default Poster;
