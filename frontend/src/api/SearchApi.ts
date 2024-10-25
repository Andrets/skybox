import { apiSlice } from "@/app/store/api";
import {
  SearchHistoryResponse,
  SearchResultResponse,
  TransformHistoryResponseItem,
} from "@/shared/models/SearchApi";

const INITDATA = window.Telegram.WebApp.initData;
const encodedToken = encodeURIComponent(INITDATA);

export const searchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResultResponse["results"], string>({
      query: (params) => {
        return {
          url: `serail/search?query=${params}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            InitData: `${encodedToken}`,
          },
        };
      },
      providesTags: ["Language"],
      transformResponse: (res: SearchResultResponse) => {
        return res.results;
      },
    }),

    getSearchHistory: builder.query<TransformHistoryResponseItem[], void>({
      query: () => {
        return {
          url: "users/search-history/",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            InitData: `${encodedToken}`,
          },
        };
      },
      transformResponse: (res: SearchHistoryResponse) => {
        let result: TransformHistoryResponseItem[] = [];
        const searchHistory = res.search_history;
        const setSearch = new Set<string>();
        for (let i = 0; i < searchHistory.length && result.length < 10; i++) {
          if (!setSearch.has(searchHistory[i])) {
            let el = { id: Math.random(), value: searchHistory[i] };
            result.push(el);
            setSearch.add(searchHistory[i]);
          }
        }

        return result;
      },
    }),
  }),
});

export const { useSearchQuery, useLazySearchQuery, useGetSearchHistoryQuery } =
  searchApiSlice;
