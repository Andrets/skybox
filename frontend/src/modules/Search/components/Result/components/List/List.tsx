import { ResultItem } from "@/modules/Search/ui";
import { SearchResultResponse } from "@/shared/models/SearchApi";
import { Layout } from "../../ui";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
export const List = ({ data }: { data: SearchResultResponse["results"] }) => {
  const { t } = useTranslation();
  if (data.length === 0) {
    return (
      <Layout childContainerClassName={styles.empty}>
        <span className={styles.notify}>{t("searchEmptyResults")}</span>
      </Layout>
    );
  }
  return (
    <Layout>
      {data.map((el) => {
        return (
          <ResultItem
            to={`/filmVideo/${el.id}`}
            key={el.id}
            poster={el.vertical_photo ? el.vertical_photo : ""}
            header={el.name}
            category={el.genre}
            status={""}
           
          />
        );
      })}
    </Layout>
  );
};
