import { useGetHistoryQuery } from "@/api/userApi";
import { WatchHistoryLayout } from "./layouts/Layout";
import { List, Loading } from "./components";

export const WatchHistory = () => {
  const { data, isLoading, isError } = useGetHistoryQuery();

  if (isLoading) {
    return (
      <WatchHistoryLayout>
        <Loading />
      </WatchHistoryLayout>
    );
  }

  if (isError) {
    return <WatchHistoryLayout></WatchHistoryLayout>;
  }

  if (data) {
    return (
      <WatchHistoryLayout>
        <List data={data} />
      </WatchHistoryLayout>
    );
  }

  return <></>;
};
