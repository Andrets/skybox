import { Avatar } from "@mui/material";
import styles from "./styles.module.scss";
import { FC } from "react";
import { ICommentsItem } from "../../model/CommentsItem";
const UserInfo: FC<Pick<ICommentsItem, "avatar" | "username">> = ({
  avatar,
  username,
}) => {
  return (
    <div className={styles.userInfo}>
      <Avatar src={avatar} sizes="24" />
      <span className={styles.name}>{username}</span>
    </div>
  );
};

export default UserInfo;
