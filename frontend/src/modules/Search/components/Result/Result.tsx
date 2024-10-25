import { useSearchQuery } from "@/api/SearchApi";
import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { List, Loading, Unitializated } from "./components";

export const Result = () => {
  const searchQueryValue = useAppSelector(
    (state) => state.searchInput.searchQueryValue
  );

  const {
    data: currentData,
    isError,
    isFetching,
    isUninitialized,
  } = useSearchQuery(searchQueryValue ? searchQueryValue : "", {
    skip: searchQueryValue ? false : true,
  });

  if (isUninitialized) {
    return <Unitializated />;
  }

  if (isFetching) {
    return <Loading />;
  }

  if (isError) {
    return <></>;
  }

  if (currentData) {
    return <List data={currentData} />;
  }

  return <></>;
};
