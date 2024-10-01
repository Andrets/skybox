import styles from "./styles.module.scss";
import CommentsItem from "./ui/CommentsItem";
import posterIMG from "@images/poster.png";

const CommentsBlock = () => {
  return (
    <ul className={styles.list}>
      <li>
        <CommentsItem
          text={
            "text comment text comment text comment text comment text comment text comment text comment"
          }
          avatar={posterIMG}
          username="Ekaterina"
        />
      </li>

      <li>
        <CommentsItem
          text={
            "text comment text comment text comment text comment text comment text comment text comment"
          }
          avatar={posterIMG}
          username="Ekaterina"
        />
      </li>

      <li>
        <CommentsItem
          text={
            "text comment text comment text comment text comment text comment text comment text comment"
          }
          avatar={posterIMG}
          username="Ekaterina"
        />
      </li>

      <li>
        <CommentsItem
          text={
            "text comment text comment text comment text comment text comment text comment text comment"
          }
          avatar={posterIMG}
          username="Ekaterina"
        />
      </li>
    </ul>
  );
};

export default CommentsBlock;
