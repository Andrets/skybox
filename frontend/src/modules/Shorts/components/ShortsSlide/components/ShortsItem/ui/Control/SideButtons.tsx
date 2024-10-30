import {
  BookmarkButton,
  EpisodeButton,
} from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";
import { memo, MouseEventHandler } from "react";
import { SideButtonsProps } from "../../model/ControlProps";
import { useSendLikeMutation } from "@/api/ShortsApi";
import { useNavigate } from "react-router-dom";

export const SideButtons = memo(
  ({ is_liked, likes, id, serail_id }: SideButtonsProps) => {
    const [sendLikeQuery] = useSendLikeMutation();
    const onClickLike: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.stopPropagation();

      sendLikeQuery({ shorts_id: id, serail_id: serail_id });
    };

    const navigate = useNavigate();
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
          onClick={() => {
            navigate(`/filmVideo/${serail_id}`);
          }}
          className={`${styles.btn} ${styles.liked}`}
        />
      </div>
    );
  }
);
