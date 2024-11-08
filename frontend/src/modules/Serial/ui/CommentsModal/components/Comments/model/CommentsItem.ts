
import { HTMLAttributes } from "react";

export interface ICommentsItem {
  avatar?: string;
  username: string;
  text: string;
}

export interface CommentsItemProps
  extends HTMLAttributes<HTMLLIElement>,
    ICommentsItem {}
