import { OptionLanguage } from "../../ui";
import styles from "./styles.module.scss";
export const LanguageList = () => {
  return (
    <div className={`container ${styles.container}`}>
      <OptionLanguage title="Русский" subtitle="Русский" isActive={true} />
      <OptionLanguage title="Русский" subtitle="Русский" />
      <OptionLanguage title="Русский" subtitle="Русский" />
      <OptionLanguage title="Русский" subtitle="Русский" />
    </div>
  );
};
