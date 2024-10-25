import { apiSlice } from "@/app/store/api";
import { isNotFoundShortsDetail } from "@/shared/helpers/checkTypeFunctions";
import {
  NotFoundShortsDetail,
  ShortsItemModel,
} from "@/shared/models/ShortsApi";

export const shortsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShorts: builder.query<(ShortsItemModel | NotFoundShortsDetail)[], void>({
      query: () => {
        return {
          url: "series/get_shorts",
          method: "GET",
        };
      },
      transformResponse: (res: NotFoundShortsDetail | ShortsItemModel[]) => {
        if (isNotFoundShortsDetail(res)) {
          return [res];
        }
        return res;
      },
      transformErrorResponse: () => {
        return [{ details: "not found" }];
      },
      merge: (currentCache, newItems) => {
        return [...currentCache, ...newItems];
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
    }),
    metrikView: builder.mutation<unknown, number>({
      query: (param) => {
        return {
          url: "series/make_viewed/",
          method: "POST",
          body: { series_id: param },
        };
      },
    }),
  }),
});

export const { useGetShortsQuery, useMetrikViewMutation } = shortsApiSlice;
