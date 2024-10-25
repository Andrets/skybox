import useBlockScroll from "@/shared/hooks/useBlockScroll";
import styles from "./styles.module.scss";
import { LoaderSpinner } from "@/ui/Icons";

export const LoaderScreen = () => {
  useBlockScroll(true);

  return (
    <div className={styles.container}>
      <LoaderSpinner className={styles.spinner} />
    </div>
  );
};
