import { apiSlice } from "@/app/store/api";
import { LANGUAGESLIST } from "@/shared/constants/constants";
import {
  SubscriptionPlanModel,
  SubscriptionPlanObject,
  TransformUserInfoResponseItem,
  UserInfoResponseItem,
  WatchHistoryItem,
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
      invalidatesTags: ["Language"],
    }),
    getHistory: builder.query<WatchHistoryItem[], void>({
      query: () => {
        return { method: "GET", url: "history/get_history" };
      },
      providesTags: ["Language"],
    }),
    getSubPrices: builder.query<SubscriptionPlanObject, void>({
      query: () => {
        return { method: "GET", url: "subscriptions/get_subscription_price" };
      },
      transformResponse: (res: SubscriptionPlanModel[]) => {
        const subscriptionPlanObject: SubscriptionPlanObject = res.reduce(
          (acc, plan) => ({
            ...acc,
            [plan.subtype]: {
              price_in_rubles: plan.price_in_rubles,
              price_in_stars: plan.price_in_stars,
            },
          }),
          {}
        );

        return subscriptionPlanObject;
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useAuthorizationQuery,
  useGetWatchHistoryQuery,
  useChangeUserLangMutation,
  useGetHistoryQuery,
  useGetSubPricesQuery,
} = userApiSlice;
