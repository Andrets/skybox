import { ICommentsItem } from "../../model/CommentsItem";
import styles from "./styles.module.scss";
import { FC } from "react";
const Text: FC<Pick<ICommentsItem, "text">> = ({ text }) => {
  return <p className={styles.text}>{text}</p>;
};

export default Text;
