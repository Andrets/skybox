import { useTranslation } from "react-i18next";
import { SettingsLinkButton } from "../../ui";
import styles from "./styles.module.scss";
import { ReactComponent as ArrowRight } from "@icons/ArrowRight.svg";

export const SettingsLinkList = () => {
  const { t } = useTranslation();
  return (
    <div className={`container ${styles.container}`}>
      <SettingsLinkButton
        className={styles.link}
        name={t("language")}
        to="/lang"
      >
        <span className={styles.language}>
          English <ArrowRight />
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
