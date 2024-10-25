import { useGetTermsQuery } from "@/api/DocumentsApi";
import styles from "./styles.module.scss";
import { LoaderSpinner } from "@/ui/Icons";
export const TermsOfUse = () => {
  const { data, isLoading } = useGetTermsQuery();

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
