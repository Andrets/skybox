import { SectionHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";
import { LikeItem } from "./ui";
import { useTranslation } from "react-i18next";
import useBackButton from "@/shared/hooks/useBackButton";
import { useGetLikesQuery } from "@/api/userApi";
import { LoaderSpinner } from "@/ui/Icons";

const Likes = () => {
  const { t } = useTranslation();
  useBackButton();

  const { data, isLoading } = useGetLikesQuery();

  if (isLoading) {
    return (
      <div className={`container ${styles.container}`}>
        <SectionHeader className={styles.header}>{t("myList")}</SectionHeader>

        <LoaderSpinner className={styles.spinner} />
      </div>
    );
  }

  if (data) {
    return (
      <div className={`container`}>
        <SectionHeader className={styles.header}>{t("myList")}</SectionHeader>

        <div className={styles.list}>
          {data.map((el, index) => {
            return (
              <LikeItem
                key={index}
                name={el.name}
                poster={el.cover ? el.cover : ""}
                to={`/filmVideo/${el.id}`}
              />
            );
          })}
        </div>
      </div>
    );
  }
};

export default Likes;
