import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import styles from "./styles.module.scss";
import { toggleListEpisodes } from "@/modules/Serial/slices/FilmVideoSlice";
import {
  BookmarkButton,
  EpisodeButton,
} from "@/reusable-in-pages/components/Video";
import { filmInfoApiSlice, useLikeSerialMutation } from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";
import { MouseEventHandler } from "react";
const SideButtons = ({
  likes,
  isLiked,
}: {
  likes: string;
  isLiked: boolean;
}) => {
  const { id } = useParams();
  const [likeQuery] = useLikeSerialMutation();
  const dispatch = useAppDispatch();

  const handleEpisodeBtn = () => {
    dispatch(toggleListEpisodes(true));
  };

  const handleLike: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (id) {
      dispatch(
        filmInfoApiSlice.util.updateQueryData("getFilmInfo", id, (draft) => {
          if (draft.user_has_liked) {
            draft.likes -= 1;
          } else {
            draft.likes += 1;
          }
          draft.user_has_liked = !draft.user_has_liked;
          return draft;
        })
      );
      likeQuery(id);
    }
  };
  return (
    <div className={styles.sideBtnsCont}>
      <EpisodeButton onClick={handleEpisodeBtn} className={styles.btn} />
      <BookmarkButton
        onClick={handleLike}
        isActive={isLiked}
        className={styles.btn}
      >
        {likes}
      </BookmarkButton>
    </div>
  );
};

export default SideButtons;
