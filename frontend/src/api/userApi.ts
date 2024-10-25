import { apiSlice } from "@/app/store/api";
import { LANGUAGESLIST } from "@/shared/constants/constants";
import {
  TransformUserInfoResponseItem,
  UserInfoResponseItem,
} from "@/shared/models/UserInfoApi";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    authorization: builder.query<TransformUserInfoResponseItem, void>({
      query: () => {
        return {
          url: "/users/",
          method: "GET",
        };
      },
      transformResponse: (res: UserInfoResponseItem[]) => {
        let userInfo = res[0];
        let result: TransformUserInfoResponseItem = {
          isActive: userInfo.isActive,
          lang: userInfo.lang.lang_name,
          name: userInfo.name,
          paid: userInfo.paid,
          photo: userInfo.photo,
          tg_id: userInfo.tg_id,
          tg_username: userInfo.tg_username,
        };

        return result;
      },
    }),
    getWatchHistory: builder.query<unknown, void>({
      query: () => {
        return {
          method: "GET",

          url: "history/",
        };
      },
    }),
    changeUserLang: builder.mutation<unknown, LANGUAGESLIST>({
      query: (params) => {
        return {
          method: "POST",
          url: "users/change_lang/",
          body: {
            lang_name: params,
          },
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useAuthorizationQuery,
  useGetWatchHistoryQuery,
  useChangeUserLangMutation,
} = userApiSlice;
