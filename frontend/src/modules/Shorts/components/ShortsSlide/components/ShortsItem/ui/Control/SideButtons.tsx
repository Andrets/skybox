import {
  BookmarkButton,
  EpisodeButton,
} from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";
import { memo } from "react";

export const SideButtons = memo(() => {
  return (
    <div className={styles.sideButtons}>
      <BookmarkButton
        onClick={(e) => {
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
        className={styles.btn}
      >
        25 k
      </BookmarkButton>
      <EpisodeButton
        onClick={(e) => {
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
        className={styles.btn}
      />
    </div>
  );
});
