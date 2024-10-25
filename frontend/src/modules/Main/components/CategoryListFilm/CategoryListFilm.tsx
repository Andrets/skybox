import "./styles.scss";
import { useGetTopSerialsQuery } from "../../../../api/MainPageApi";
import { List, Loading } from "./components";

export const CategoryListFilm = () => {
  const { data, isLoading, isError } = useGetTopSerialsQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <></>;
  }

  if (data) {
    return <List data={data} />;
  }

  return <></>;
};
