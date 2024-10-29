import { apiSlice } from "@/app/store/api";
import {
  CreateCommentQueryParams,
  FilmInfoResponse,
  SeriesItem,
  UpdateRatingBody,
} from "@/shared/models/FilmInfoApi";

const INITDATA = window.Telegram.WebApp?.initData;
const encodedToken = encodeURIComponent(INITDATA);

export const filmInfoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFilmInfo: builder.query<FilmInfoResponse, string | number>({
      query: (params) => {
        return {
          url: `serail/get_serail_details?data=${params}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            InitData: `${encodedToken}`,
          },
        };
      },
      providesTags: ["Language"],
      transformResponse: (response: FilmInfoResponse[]) => {
        return response[0];
      },
    }),

    getAllSeries: builder.query<SeriesItem[], string | number>({
      query: (params) => {
        return {
          url: `series/get_series_by_serail?data=${params}`,
          method: "GET",
        };
      },
    }),

    createComment: builder.mutation<unknown, CreateCommentQueryParams>({
      query: (params) => {
        return {
          url: "comments/create_comment/",
          method: "POST",

          body: params,
        };
      },
    }),

    updateRating: builder.mutation<unknown, UpdateRatingBody>({
      query: (params) => {
        return {
          url: "serail/update_rating/",
          method: "POST",
          body: params,
        };
      },
    }),

    addHistory: builder.mutation<unknown, number>({
      query: (params) => {
        return {
          url: "history/add_to_history/",
          method: "POST",
          body: {
            serail_id: params,
          },
        };
      },
    }),
  }),
});

export const {
  useGetFilmInfoQuery,
  useCreateCommentMutation,
  useGetAllSeriesQuery,
  useUpdateRatingMutation,
  useAddHistoryMutation,
} = filmInfoApiSlice;
