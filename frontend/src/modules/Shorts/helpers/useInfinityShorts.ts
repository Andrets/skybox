import { useGetShortsQuery } from "@/api/ShortsApi";
import ShortsListContext from "@/reusable-in-pages/contexts/ShortsListContext/context";

import { useContext, useEffect} from "react";

export const useInfinityShorts = () => {
  const { activeSlideIndex } = useContext(ShortsListContext);

  const { data, refetch } = useGetShortsQuery();

  useEffect(() => {
    if (data && activeSlideIndex === data?.length - 1) {
      refetch();
    }
  }, [activeSlideIndex]);
};
