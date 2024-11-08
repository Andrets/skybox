import styles from "./styles.module.scss";
import { memo, MouseEventHandler } from "react";

import { useNavigate } from "react-router-dom";
import { SideButtonPlayer } from "@/ui/SideButtonPlayer/SideButtonPlayer";
import { ReactComponent as BookmarkSVG } from "@icons/BookmarkWidth.svg";
import { ReactComponent as LikeSVG } from "@icons/Like.svg";
import { ReactComponent as EpisodeSVG } from "@icons/Episode.svg";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import {
  useLikeSerialMutation,
  useLikeSeriesMutation,
} from "@/api/FilmInfoApi";
import { shortsApiSlice } from "@/api/ShortsApi";

export const SideButtons = memo(() => {
  // const [sendLikeQuery] = useSendLikeMutation();

  const dispatch = useAppDispatch();

  const [sendLikeSerial] = useLikeSerialMutation();
  const [sendLikeSeries] = useLikeSeriesMutation();

  const shortsInfo = useAppSelector(
    (state) => state.shorts.activeShortsItemInfo
  );
  const onClickFav: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (shortsInfo) {
      sendLikeSerial(shortsInfo.serail_id);
      dispatch(
        shortsApiSlice.util.updateQueryData("getShorts", undefined, (draft) => {
          if (shortsInfo) {
            for (let i = 0; i < draft.length; i++) {
              if (draft[i].serail_id === shortsInfo.serail_id) {
                draft[i].user_has_favorited = !draft[i].user_has_favorited;
              }
            }
          }

          return draft;
        })
      );
    }
  };

  const onClickLike: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (shortsInfo) {
      sendLikeSeries(shortsInfo.id);

      dispatch(
        shortsApiSlice.util.updateQueryData("getShorts", undefined, (draft) => {
          if (shortsInfo) {
            for (let i = 0; i < draft.length; i++) {
              if (draft[i].id === shortsInfo.id) {
                if (draft[i].is_liked) {
                  draft[i].likes -= 1;
                } else {
                  draft[i].likes += 1;
                }
                draft[i].is_liked = !draft[i].is_liked;
                return draft;
              }
            }
          }
          return draft;
        })
      );
    }
  };

  const { t } = useTranslation();

  const navigate = useNavigate();
  return (
    <div className={styles.sideButtons}>
      <SideButtonPlayer
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
        onClick={onClickLike}
      >
        <LikeSVG
          className={`${styles.likeSVG} ${
            shortsInfo?.is_liked ? styles.likeActive : ""
          }`}
          width={24}
          height={24}
        />
        {shortsInfo?.likes ? shortsInfo.likes : "0"}
      </SideButtonPlayer>
      <SideButtonPlayer
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
        onClick={onClickFav}
      >
        <BookmarkSVG
          className={shortsInfo?.user_has_favorited ? styles.serialLikeSvg : ""}
        />
        {t("bottomNavigation.liked")}
      </SideButtonPlayer>

      <SideButtonPlayer
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
          navigate(`/filmVideo/${shortsInfo?.serail_id}`);
        }}
      >
        <EpisodeSVG />
        {t("episodes")}
      </SideButtonPlayer>
    </div>
  );
});
