import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import styles from "./styles.module.scss";
import { toggleListEpisodes } from "@/modules/FilmVideo/slices/FilmVideoSlice";
import {
  BookmarkButton,
  EpisodeButton,
} from "@/reusable-in-pages/components/Video";
const SideButtons = () => {
  const dispatch = useAppDispatch();

  const handleEpisodeBtn = () => {
    dispatch(toggleListEpisodes(true));
  };
  return (
    <div className={styles.sideBtnsCont}>
      <EpisodeButton onClick={handleEpisodeBtn} className={styles.btn} />
      <BookmarkButton className={styles.btn}>25 k</BookmarkButton>
    </div>
  );
};

export default SideButtons;
