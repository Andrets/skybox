import { ExploreItem } from "../../ui";
import styles from "./styles.module.scss";

import { SectionHeader } from "@/ui/SectionHeader";
export const ExploreList = () => {
  return (
    <>
      <SectionHeader className={`${styles.header} container`}>
        Search history
      </SectionHeader>
      <div className={styles.list}>
        <ExploreItem
          className={styles.exploreItem}
          exploreValue="Strong Heroine"
        />
        <ExploreItem className={styles.exploreItem} exploreValue="Reunion" />
      </div>
    </>
  );
};


