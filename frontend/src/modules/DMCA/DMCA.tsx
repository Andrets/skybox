import { useGetDMCAQuery } from "@/api/DocumentsApi";
import styles from "./styles.module.scss";
import { LoaderSpinner } from "@/ui/Icons";
export const DMCA = () => {
  const { data, isLoading } = useGetDMCAQuery();

  if (isLoading) {
    return (
      <div className={`container ${styles.container} ${styles.empty}`}>
        <LoaderSpinner />
      </div>
    );
  }

  if (data) {
    return <div className={`container ${styles.container}`}>{data.text}</div>;
  }

  return <></>;
};
