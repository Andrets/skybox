import { LANGUAGESLIST } from "../constants/constants";

export interface UserInfoResponseItem {
  country: { id: 1; country_name: string; country_lang: 1 };
  isActive: boolean;
  lang: { id: number; lang_name: LANGUAGESLIST };
  name: string;
  paid: boolean;
  photo: string;
  search_history: string[]; // Assuming search history is an array of strings
  tg_id: number;
  tg_username: string;
}

export interface TransformUserInfoResponseItem {
  isActive: boolean;
  lang: LANGUAGESLIST;
  name: string;
  paid: boolean;
  photo: string;
  tg_id: number;
  tg_username: string;
}

export interface WatchHistoryItem {
  cover: string | null;
  id: number;
  name: string;
}

export enum SubscriptionSubtype {
  TEMPORARILY_MONTH = "TEMPORARILY_MONTH",
  TEMPORARILY_YEAR = "TEMPORARILY_YEAR",
  TEMPORARILY_WEEK = "TEMPORARILY_WEEK",
}

export interface SubscriptionPlanModel {
  subtype: SubscriptionSubtype;
  price_in_rubles: number;
  price_in_stars: number;
}

export interface SubscriptionPlanObject {
  [key: string]: Omit<SubscriptionPlanModel, "subtype">;
}

export interface PaymentData {
  amount: {
    currency: string;
    value: string;
  };
  confirmation: {
    confirmation_url: string;
    return_url: string;
    type: string;
  };
  created_at: string;
  description: string;
  id: string;
  metadata: {
    cms_name: string;
  };
  paid: boolean;
  payment_method: {
    id: string;
    saved: boolean;
    type: string;
  };
  recipient: {
    account_id: string;
    gateway_id: string;
  };
  refundable: boolean;
  status: string;
  test: boolean;
}

export interface ListLikeItem {
  id: number;
  name: string;
  cover: string | null;
}

export interface CreatePaymentParams {
  subType: string;
}

export interface CreatePaymentSerialParams {
  paymentToken: string;
  serial_id: string | number;
}

export interface PaymentCreateStatusResponse {
  payment_id: number;
  status: string;
}

export function isSubscriptionSubtype(
  value: any
): value is SubscriptionSubtype {
  return Object.values(SubscriptionSubtype).includes(value);
}

export interface TGStarsPaymentResponse {
  payment_link: string;
  ready_to_pay: boolean;
  payload_token: number;
}

export interface TGStarsCheckTokenStatus {
  is_paid: boolean;
}
