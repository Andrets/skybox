import { WatchHistoryListProps } from "@/modules/Profile/model/models";
import HorizontalScrollContainer from "@/reusable-in-pages/components/HorizontalScrollContainer/HorizontalScrollContainer";
import styles from "./styles.module.scss";
import { WatchHistoryItem } from "@/modules/Profile/ui";
import { useTranslation } from "react-i18next";
export const List = ({ data }: WatchHistoryListProps) => {
  const { t } = useTranslation();
  if (data.length === 0) {
    return (
      <div className={styles.emptyContainer}>{t("emptyWatchHistory")}!</div>
    );
  }

  return (
    <HorizontalScrollContainer
      contentClassName={`${styles.listContent} `}
      className={`${styles.list} container no-padding`}
    >
      {data.map((el, index) => {
        return (
          <WatchHistoryItem
            key={index}
            className={styles.watchItem}
            name={el.name}
            poster={el.cover ? el.cover : ""}
            to={`/filmVideo/${el.id}`}
          />
        );
      })}
    </HorizontalScrollContainer>
  );
};
