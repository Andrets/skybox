import HorizontalScrollContainer from "@/reusable-in-pages/components/HorizontalScrollContainer/HorizontalScrollContainer";
import LoaderSkeletonImage from "@/ui/LoaderSkeletonImage/LoaderSkeletonImage";
import styles from "./styles.module.scss";
export const Loading = () => {
  return (
    <HorizontalScrollContainer className={styles.container}>
      <LoaderSkeletonImage className={styles.loader} />
      <LoaderSkeletonImage className={styles.loader} />
      <LoaderSkeletonImage className={styles.loader} />
      <LoaderSkeletonImage className={styles.loader} />
      <LoaderSkeletonImage className={styles.loader} />
      <LoaderSkeletonImage className={styles.loader} />
    </HorizontalScrollContainer>
  );
};
