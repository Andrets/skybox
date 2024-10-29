import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./en.json";
import translationRU from "./ru.json";
import translationTR from "./tr.json";
import translationAR from "./ar.json";
import translationCH from "./ch.json";
import translationKO from "./ko.json";

const resources: Resource = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
  tr: {
    translation: translationTR, // добавление турецкого перевода
  },
  ar: {
    translation: translationAR,
  },
  zh: {
    translation: translationCH,
  },
  ko: {
    translation: translationKO, // добавление турецкого перевода
  },
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
  preload: ["ru"],
});

export default i18n;
