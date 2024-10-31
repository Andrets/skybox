import { apiSlice } from "@/app/store/api";
import { LANGUAGESLIST } from "@/shared/constants/constants";
import { PriceResponseForSerial } from "@/shared/models/FilmInfoApi";
import {
  CreatePaymentParams,
  CreatePaymentSerialParams,
  ListLikeItem,
  PaymentCreateStatusResponse,
  SubscriptionPlanModel,
  SubscriptionPlanObject,
  TGStarsPaymentResponse,
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
    getSubPricesForSerial: builder.query<
      PriceResponseForSerial,
      string | number
    >({
      query: (params) => {
        return {
          method: "GET",
          url: `/serailprice/get_price_by_serail_id?serail_id=${params}`,
        };
      },
    }),
    getLikes: builder.query<ListLikeItem[], void>({
      query: () => {
        return { url: "favorite/get_my_list", method: "GET" };
      },
      providesTags: ["Likes"],
    }),
    createPayment: builder.mutation<
      PaymentCreateStatusResponse,
      CreatePaymentParams
    >({
      query: (params) => {
        return {
          method: "POST",
          url: `payments/create_payment/?payment_id=${params.paymentToken}&subscription_type=${params.subType}`,
        };
      },
    }),

    createTGStarsPayment: builder.mutation<TGStarsPaymentResponse, string>({
      query: (params) => {
        return {
          method: "POST",
          url: `/payments/create_payment_stars/?subscription_type=${params}`,
        };
      },
    }),

    createPaymentForSerial: builder.mutation<
      PaymentCreateStatusResponse,
      CreatePaymentSerialParams
    >({
      query: (params) => {
        return {
          method: "POST",
          url: `payments/create_payment_serail/?payment_id=${params.paymentToken}&serail_id=${params.serial_id}`,
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
  useGetHistoryQuery,
  useGetSubPricesQuery,
  useCreatePaymentMutation,
  useCreatePaymentForSerialMutation,
  useGetSubPricesForSerialQuery,
  useCreateTGStarsPaymentMutation,
  useGetLikesQuery,
} = userApiSlice;
