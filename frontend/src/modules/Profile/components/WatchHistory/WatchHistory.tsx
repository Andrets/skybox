import { SectionHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";

import { WatchHistoryItem } from "../../ui";
import posterIMG from "@images/poster.png";
import HorizontalScrollContainer from "@/reusable-in-pages/components/HorizontalScrollContainer/HorizontalScrollContainer";

export const WatchHistory = () => {
  return (
    <>
      <div className={`container ${styles.container}`}>
        <SectionHeader className={styles.header}>Watch history</SectionHeader>
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
