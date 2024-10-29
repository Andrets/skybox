import {
  BookmarkButton,
  EpisodeButton,
} from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";
import { memo, MouseEventHandler } from "react";
import { SideButtonsProps } from "../../model/ControlProps";
import { useSendLikeMutation } from "@/api/ShortsApi";

export const SideButtons = memo(
  ({ is_liked, likes, id, serail_id }: SideButtonsProps) => {
    const [sendLikeQuery] = useSendLikeMutation();
    const onClickLike: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.stopPropagation();

      sendLikeQuery({ shorts_id: id, serail_id: serail_id });
    };
    return (
      <div className={styles.sideButtons}>
        <BookmarkButton
          onClick={onClickLike}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          className={styles.btn}
          isActive={is_liked}
        >
          {likes}
        </BookmarkButton>
        <EpisodeButton
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
          }}
          className={`${styles.btn} ${styles.liked}`}
        />
      </div>
    );
  }
);
