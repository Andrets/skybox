import { useTranslation } from "react-i18next";
import { Layout } from "../../ui";
import styles from "./styles.module.scss";

export const Unitializated = () => {
  const { t } = useTranslation();
  return (
    <Layout childContainerClassName={styles.container}>
      <p className={styles.notify}>{t("notEnterSearch")}!</p>
    </Layout>
  );
};
