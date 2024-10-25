import { FilmInfoProps } from "@/modules/FilmInfo/model/models";
import styles from "./styles.module.scss";
import CommentsItem from "./ui/CommentsItem";

const CommentsBlock = ({ comments }: Pick<FilmInfoProps, "comments">) => {
  if (comments.length === 0) {
    return (
      <div className={styles.emptyList}>
        <span>Комментариев пока нет</span>
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
};

export default CommentsBlock;
