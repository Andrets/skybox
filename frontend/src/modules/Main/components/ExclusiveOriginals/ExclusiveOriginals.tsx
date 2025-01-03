import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { useGetExclusiveQuery } from "../../../../api/MainPageApi";

import { ExclusiveList, ExclusiveLoading } from "./components";
import { ExclusiveOriginalsSearchParams } from "@/shared/models/MainPageApi";

export const ExclusiveOriginals = () => {
  const activeCategory = useAppSelector(
    (state) => state.mainSlice.activeCategory
  );
  const { data, isLoading, isFetching, isError } = useGetExclusiveQuery(
    ExclusiveOriginalsSearchParams[activeCategory]
  );

  if (isLoading || isFetching) {
    return <ExclusiveLoading />;
  }

  if (isError) {
    return <ExclusiveLoading />;
  }

  if (data) {
    return <ExclusiveList data={data} />;
  }

  return <></>;
};
