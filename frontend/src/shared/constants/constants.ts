export const WebApp = window.Telegram.WebApp;
export const BASE_URL = "https://skybox.video";

export const INITDATA = window.Telegram.WebApp?.initData;
export const encodedToken = encodeURIComponent(INITDATA);

export enum LANGUAGESLIST {
  ko = "ko",
  en = "en",
  ru = "ru",
  tr = "tr",
  ar = "ar",
  zh = "zh",
}
