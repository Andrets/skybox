import { apiSlice } from "@/app/store/api";
import {
  CreateCommentQueryParams,
  FilmInfoResponse,
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

    createComment: builder.mutation<unknown, CreateCommentQueryParams>({
      query: (params) => {
        return {
          url: "comments/create_comment/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            InitData: `${encodedToken}`,
          },
          body: params,
        };
      },
    }),
  }),
});

export const { useGetFilmInfoQuery, useCreateCommentMutation } =
  filmInfoApiSlice;
