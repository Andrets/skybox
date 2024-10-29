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
