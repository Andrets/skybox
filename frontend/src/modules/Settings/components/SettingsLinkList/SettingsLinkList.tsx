import { SettingsLinkButton } from "../../ui";
import styles from "./styles.module.scss";
import { ReactComponent as ArrowRight } from "@icons/ArrowRight.svg";

export const SettingsLinkList = () => {
  return (
    <div className={`container ${styles.container}`}>
      <SettingsLinkButton className={styles.link} name="Language" to="/lang">
        <span className={styles.language}>
          English <ArrowRight />
        </span>
      </SettingsLinkButton>
      <SettingsLinkButton
        className={styles.link}
        name="Terms of Use"
        to="/termsofuse"
      >
        <ArrowRight />
      </SettingsLinkButton>
      <SettingsLinkButton
        className={styles.link}
        name="Privacy policy"
        to="/privacyPolicy"
      >
        <ArrowRight />
      </SettingsLinkButton>
      <SettingsLinkButton className={styles.link} name="DMCA" to="/dmca">
        <ArrowRight />
      </SettingsLinkButton>
    </div>
  );
};
