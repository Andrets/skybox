import { useTranslation } from "react-i18next";
import { ExploreItem } from "../../ui";
import styles from "./styles.module.scss";

import { SectionHeader } from "@/ui/SectionHeader";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import {
  setSearchInput,
  setSearchQueryValue,
} from "@/reusable-in-pages/slices/SearchFormSlice";
import { useGetSearchHistoryQuery, useLazySearchQuery } from "@/api/SearchApi";
export const ExploreList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { data: searchHistory } = useGetSearchHistoryQuery();
  const [searchQuery] = useLazySearchQuery();

  const handleSearchElem =
    (el: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(setSearchInput(el));
      dispatch(setSearchQueryValue(el));
      searchQuery(el);
    };
  return (
    <>
      <SectionHeader className={`${styles.header} container`}>
        {t("searchHistory")}
      </SectionHeader>
      <div className={styles.list}>
        {searchHistory &&
          searchHistory.map((el) => {
            return (
              <ExploreItem
                className={styles.exploreItem}
                key={el.id}
                onClick={handleSearchElem(el.value)}
                exploreValue={el.value}
              />
            );
          })}
      </div>
    </>
  );
};
