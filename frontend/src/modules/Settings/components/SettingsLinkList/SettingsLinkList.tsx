import { useTranslation } from "react-i18next";
import { SettingsLinkButton } from "../../ui";
import styles from "./styles.module.scss";
import { ReactComponent as ArrowRight } from "@icons/ArrowRight.svg";
import { useAuthorizationQuery } from "@/api/userApi";

export enum LANGUAGESLIST {
  ko = " 한국어",
  en = "English",
  ru = "Русский",
  tr = "Türkçe",
  ar = "لعربية",
  zh = "中文",
}

export const SettingsLinkList = () => {
  const { t } = useTranslation();
  const {data} = useAuthorizationQuery()
  return (
    <div className={`container ${styles.container}`}>
      <SettingsLinkButton
        className={styles.link}
        name={t("language")}
        to="/lang"
      >
        <span className={styles.language}>
          {data?.lang && LANGUAGESLIST[data?.lang]} <ArrowRight />
        </span>
      </SettingsLinkButton>
      <SettingsLinkButton
        className={styles.link}
        name={t("termsOfUse")}
        to="/termsofuse"
      >
        <ArrowRight />
      </SettingsLinkButton>
      <SettingsLinkButton
        className={styles.link}
        name={t("privacyPolicy")}
        to="/privacyPolicy"
      >
        <ArrowRight />
      </SettingsLinkButton>
      <SettingsLinkButton className={styles.link} name={t("dmca")} to="/dmca">
        <ArrowRight />
      </SettingsLinkButton>
    </div>
  );
};
