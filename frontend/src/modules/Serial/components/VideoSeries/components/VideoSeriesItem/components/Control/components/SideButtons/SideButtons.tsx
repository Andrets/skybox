import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import styles from "./styles.module.scss";
import {
  setIsCommentsModalOpen,
  setOpenRating,
  toggleListEpisodes,
} from "@/modules/Serial/slices/FilmVideoSlice";
import {
  filmInfoApiSlice,
  useGetFilmInfoQuery,
  useLazyGetShareLinkQuery,
  useLikeSerialMutation,
  useLikeSeriesMutation,
} from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";
import { MouseEventHandler } from "react";
import { ReactComponent as RateSVG } from "@icons/Star.svg";
import { ReactComponent as LikeSVG } from "@icons/Like.svg";
import { ReactComponent as CommentSVG } from "@icons/Comment.svg";
import { ReactComponent as ShareSVG } from "@icons/Share.svg";
import { ReactComponent as EpisodeSVG } from "@icons/Episode.svg";
import { ReactComponent as BookmarkSVG } from "@icons/BookmarkWidth.svg";
import { SideButtonPlayer } from "../../../../ui";
import { useTranslation } from "react-i18next";
import { useTelegram } from "@/shared/hooks/useTelegram";
const SideButtons = () => {
  const { id } = useParams();
  const { data: filmInfoData } = useGetFilmInfoQuery(id ? id : "", {
    skip: id ? false : true,
  });
  const [getLinkQuery] = useLazyGetShareLinkQuery();
  const [likeSerialQuery] = useLikeSerialMutation();
  const [likeSeriesQuery] = useLikeSeriesMutation();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { webApp } = useTelegram();
  const activeSeriesItemData = useAppSelector(
    (state) => state.filmVideo.isCurrentSeriesInfoData
  );

  const activeEpisode = useAppSelector(
    (state) => state.filmVideo.activeEpisode
  );

  const handleEpisodeBtn = () => {
    dispatch(toggleListEpisodes(true));
  };

  const handleLike: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (id) {
      dispatch(
        filmInfoApiSlice.util.updateQueryData("getAllSeries", id, (draft) => {
          if (draft[activeEpisode].is_liked) {
            draft[activeEpisode].likes -= 1;
          } else {
            draft[activeEpisode].likes += 1;
          }
          draft[activeEpisode].is_liked = !draft[activeEpisode].is_liked;
        })
      );

      if (activeSeriesItemData?.id) {
        likeSeriesQuery(activeSeriesItemData.id);
      }
    }
  };

  const handleFav: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (activeSeriesItemData?.id) {
      if (id)
        dispatch(
          filmInfoApiSlice.util.updateQueryData("getFilmInfo", id, (draft) => {
            draft.user_has_liked = !draft.user_has_liked;
            return draft;
          })
        );
      likeSerialQuery(activeSeriesItemData?.id);
    }
  };

  const handleShare: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();

    if (activeSeriesItemData?.id) {
      const response = await getLinkQuery(activeSeriesItemData?.id);
      if (response?.data) {
        webApp.openTelegramLink(response.data);
      }
    }
  };

  return (
    <div className={styles.sideBtnsCont}>
      <SideButtonPlayer
        onClick={() => {
          dispatch(setOpenRating(true));
        }}
      >
        {" "}
        <RateSVG />
        {t("rate")}
      </SideButtonPlayer>

      <SideButtonPlayer onClick={handleLike}>
        <LikeSVG
          className={`${styles.likeSVG} ${
            activeSeriesItemData?.is_liked ? styles.likeActive : ""
          }`}
          stroke={`${
            activeSeriesItemData?.is_liked
              ? "var(--main-theme-color-2)"
              : "white"
          }`}
          width={24}
          height={24}
        />
        {activeSeriesItemData?.likes}
      </SideButtonPlayer>

      <SideButtonPlayer onClick={handleFav}>
        <BookmarkSVG
          className={filmInfoData?.user_has_liked ? styles.serialLikeSvg : ""}
          width={24}
          height={30}
        />
        {t("bottomNavigation.liked")}
      </SideButtonPlayer>

      <SideButtonPlayer
        onClick={() => {
          dispatch(setIsCommentsModalOpen(true));
        }}
      >
        {" "}
        <CommentSVG />
        {filmInfoData?.comments}
      </SideButtonPlayer>

      <SideButtonPlayer onClick={handleEpisodeBtn}>
        <EpisodeSVG />
        {t("episodes")}
      </SideButtonPlayer>

      <SideButtonPlayer onClick={handleShare}>
        <ShareSVG />
        {t("share")}
      </SideButtonPlayer>
    </div>
  );
};

export default SideButtons;
