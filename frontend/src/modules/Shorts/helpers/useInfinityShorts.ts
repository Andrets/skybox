import { useGetShortsQuery, useMetrikViewMutation } from "@/api/ShortsApi";
import ShortsListContext from "@/reusable-in-pages/contexts/ShortsListContext/context";
import { isNotFoundShortsDetail } from "@/shared/helpers/checkTypeFunctions";

import { useContext, useEffect } from "react";

export const useInfinityShorts = () => {
  const { activeSlideIndex } = useContext(ShortsListContext);

  const { data, refetch } = useGetShortsQuery();

  const [metrikQuery] = useMetrikViewMutation();

  useEffect(() => {
    const func = async () => {
      if (data && activeSlideIndex === data?.length - 1) {
        let el = data[activeSlideIndex];
        if (!isNotFoundShortsDetail(el)) {
          await metrikQuery(el.id);
        }
        refetch();
      }
    };

    func();
  }, [activeSlideIndex]);
};
