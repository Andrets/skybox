import { SectionHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";

import { WatchHistoryItem } from "../../ui";
import posterIMG from "@images/poster.png";
import HorizontalScrollContainer from "@/reusable-in-pages/components/HorizontalScrollContainer/HorizontalScrollContainer";
import { useTranslation } from "react-i18next";

export const WatchHistory = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className={`container ${styles.container}`}>
        <SectionHeader className={styles.header}>
          {t("watchHistory")}
        </SectionHeader>
      </div>

      <HorizontalScrollContainer
        contentClassName={`${styles.listContent} `}
        className={`${styles.list} container no-padding`}
      >
        <WatchHistoryItem
          className={styles.watchItem}
          name={"Ep1 / Ep2"}
          poster={posterIMG}
          to={""}
        />
        <WatchHistoryItem
          className={styles.watchItem}
          name={"Ep1 / Ep2"}
          poster={posterIMG}
          to={""}
        />
        <WatchHistoryItem
          className={styles.watchItem}
          name={"Ep1 / Ep2"}
          poster={posterIMG}
          to={""}
        />
        <WatchHistoryItem
          className={styles.watchItem}
          name={"Ep1 / Ep2"}
          poster={posterIMG}
          to={""}
        />
        <WatchHistoryItem
          className={styles.watchItem}
          name={"Ep1 / Ep2"}
          poster={posterIMG}
          to={""}
        />
        <WatchHistoryItem
          className={styles.watchItem}
          name={"Ep1 / Ep2"}
          poster={posterIMG}
          to={""}
        />
        <WatchHistoryItem
          className={styles.watchItem}
          name={"Ep1 / Ep2"}
          poster={posterIMG}
          to={""}
        />
        <WatchHistoryItem
          className={styles.watchItem}
          name={"Ep1 / Ep2"}
          poster={posterIMG}
          to={""}
        />
      </HorizontalScrollContainer>
    </>
  );
};
