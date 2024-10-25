import styles from "./styles.module.scss";
import { useGetRecomendationsQuery } from "../../../../api/MainPageApi";
import { List, Loading } from "./components";

export const RecomendationList = () => {
  const { data, isLoading, isError } = useGetRecomendationsQuery();

  if (isLoading) {
    return (
      <div className={`container ${styles.container}`}>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <></>;
  }

  if (data) {
    return (
      <div className={`container ${styles.container}`}>
        <List data={data} />
      </div>
    );
  }

  return null;
};
