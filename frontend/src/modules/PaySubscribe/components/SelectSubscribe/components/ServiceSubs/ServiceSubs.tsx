import {
  useGetSubPricesQuery,
} from "@/api/userApi";
import { ServiceSubList, ServiceSubLoading } from "./components";

export const ServiceSubs = () => {
  const { data, isLoading } = useGetSubPricesQuery();



  if (isLoading) {
    return <ServiceSubLoading />;
  }

  if (data) {
    return (
      <>
        <ServiceSubList data={data} />
      </>
    );
  }
};
