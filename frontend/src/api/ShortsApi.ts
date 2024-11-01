import { apiSlice } from "@/app/store/api";
import { isNotFoundShortsDetail } from "@/shared/helpers/checkTypeFunctions";
import {
  SendLikeQueryParams,
  ShortsItemModel,
} from "@/shared/models/ShortsApi";

export const shortsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShorts: builder.query<ShortsItemModel[], void>({
      query: () => {
        return {
          url: "series/get_shorts",
          method: "GET",
        };
      },
      transformResponse: (res: ShortsItemModel[]) => {
        return res;
      },
      transformErrorResponse: (err) => {
        return err;
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
    sendLike: builder.mutation<unknown, SendLikeQueryParams>({
      query: (params) => {
        return {
          url: `serail/like_it?series_id=${params.shorts_id}`,
          method: "GET",
        };
      },

      async onQueryStarted(arg, { dispatch }) {
        dispatch(
          shortsApiSlice.util.updateQueryData(
            "getShorts",
            undefined,
            (draft) => {
              for (let i = 0; i < draft.length; i++) {
                let el = draft[i];

                if (
                  !isNotFoundShortsDetail(el) &&
                  el.serail_id === arg.serail_id
                ) {
                  if (el.is_liked) el.likes -= 1;
                  else el.likes += 1;
                  el.is_liked = !el.is_liked;
                }
              }
            }
          )
        );
      },
    }),
  }),
});

export const { useGetShortsQuery, useMetrikViewMutation, useSendLikeMutation } =
  shortsApiSlice;
