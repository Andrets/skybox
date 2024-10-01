import { FC } from "react";
import { CommentsItemProps } from "../../model/CommentsItem";
import UserInfo from "./UserInfo";
import Text from "./Text";

const CommentsItem: FC<CommentsItemProps> = ({ text, avatar, username }) => {
  return (
    <>
      <UserInfo avatar={avatar} username={username} />

      <Text text={text} />
    </>
  );
};

export default CommentsItem;
