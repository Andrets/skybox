import { useGetPolicyQuery } from "@/api/DocumentsApi";
import styles from "./styles.module.scss";
import { LoaderSpinner } from "@/ui/Icons";

const PrivacyPolicy = () => {
  const { data, isLoading } = useGetPolicyQuery();

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

export default PrivacyPolicy;
