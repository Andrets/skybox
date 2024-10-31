import { useGetFilmCommentsQuery } from "@/api/FilmInfoApi";
import styles from "./styles.module.scss";
import CommentsItem from "./ui/CommentsItem";
import { useParams } from "react-router-dom";
import { LoaderSpinner } from "@/ui/Icons";
import { useTranslation } from "react-i18next";

const CommentsBlock = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const {
    data: comments,
    isLoading,
    isFetching,
  } = useGetFilmCommentsQuery(id ? id : "", { skip: id ? false : true });

  if (isLoading || isFetching) {
    return (
      <div className={styles.loaderContainer}>
        <LoaderSpinner />;
      </div>
    );
  }

  if (comments) {
    if (comments.length === 0) {
      return (
        <div className={styles.emptyList}>
          <span>{t("commentsNotFound")}</span>
        </div>
      );
    }
    return (
      <ul className={styles.list}>
        {comments.map((el, index) => {
          return (
            <li key={index}>
              <CommentsItem
                text={el.text}
                avatar={el.user_avatar}
                username={el.tg_username}
              />
            </li>
          );
        })}
      </ul>
    );
  }
};

export default CommentsBlock;
