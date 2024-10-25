import { apiSlice } from "@/app/store/api";
import {
  ExclusiveFilmList,
  ExclusiveOriginalsSearchParams,
  RecomendationFilmList,
  TopSerial,
  TopSerialList,
} from "@/shared/models/MainPageApi";

const INITDATA = window.Telegram.WebApp?.initData;
const encodedToken = encodeURIComponent(INITDATA);

export const mainPageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopSerials: builder.query<TopSerial[], void>({
      query: () => {
        return {
          url: "serail/get_top_3",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            InitData: `${encodedToken}`,
          },
        };
      },
      transformResponse: (res: TopSerialList) => {
        return res.top_3;
      },
      providesTags: ["Language"],
    }),
    getRecomendations: builder.query<
      RecomendationFilmList["you_might_like"],
      void
    >({
      query: () => {
        return {
          url: "serail/get_you_might_like",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            InitData: encodedToken,
          },
        };
      },
      transformResponse: (response: RecomendationFilmList) => {
        return response.you_might_like;
      },
      providesTags: ["Language"],
    }),
    getExclusive: builder.query<
      ExclusiveFilmList["serials"],
      ExclusiveOriginalsSearchParams
    >({
      query: (params) => {
        return {
          url: `serail/get_category_serials?data=${params}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            InitData: encodedToken,
          },
        };
      },
      transformResponse: (response: ExclusiveFilmList) => {
        return response.serials;
      },
      providesTags: ["Language"],
    }),
  }),
});

export const {
  useGetExclusiveQuery,
  useGetRecomendationsQuery,
  useGetTopSerialsQuery,
} = mainPageApiSlice;
