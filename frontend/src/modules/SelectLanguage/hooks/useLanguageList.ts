import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageItem } from "../model/LanguageListModel";
import { LANGUAGESLIST } from "@/shared/constants/constants";

export const useLanguageList = () => {
  const { t } = useTranslation();

  const [language_list, setLanguageList] = useState<LanguageItem[]>([]);

  const setLanguageListFunc = () => {
    const LANGUAGES_LIST = [
      { subtitle: "Русский", value: LANGUAGESLIST.ru, title: t("russian") },
      { subtitle: "English", value: LANGUAGESLIST.en, title: t("english") },
      { subtitle: "한국인", value: LANGUAGESLIST.ko, title: t("korean") },
      { subtitle: "中国人", value: LANGUAGESLIST.zh, title: t("chinese") },
      { subtitle: "عربي", value: LANGUAGESLIST.ar, title: t("arabian") },
      { subtitle: "Türkçe", value: LANGUAGESLIST.tr, title: t("turkish") },
    ];

    setLanguageList(LANGUAGES_LIST);
  };

  useEffect(() => {
    setLanguageListFunc();
  }, [t]);

  return language_list;
};
