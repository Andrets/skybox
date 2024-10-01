import styles from "./styles.module.scss";
import videoFile from "@/shared/assets/videos/video.mp4";
import ListEpisodes from "@/modules/FilmVideo/components/ListEpisodes";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { useRef } from "react";
import {
  setVideoCurTime,
  setVideoLength,
  togglePlayVideo,
  toggleViewControlVideo,
} from "./slices/FilmVideoSlice";

import useBlockScroll from "@/shared/hooks/useBlockScroll";
import { Control } from "./components/Control";
import { Video } from "@/reusable-in-pages/components/Video";
const FilmVideo = () => {
  useBlockScroll(true);
  const dispatch = useAppDispatch();
  const openListEp = useAppSelector(
    (state) => state.filmVideo.isOpenListEpisodes
  );
  const videoIsPlay = useAppSelector((state) => state.filmVideo.isPlayVideo);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handlePlayBtn: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const video = videoRef.current;
    e.stopPropagation();

    const videoIsPlayFunc = () => {
      if (video) {
        dispatch(togglePlayVideo(false));
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        dispatch(toggleViewControlVideo(true));
        video.pause();
      }
    };

    const videoIsPauseFunc = () => {
      if (video) {
        dispatch(togglePlayVideo(true));
        dispatch(toggleViewControlVideo(true));
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          if (timerRef.current) {
            dispatch(toggleViewControlVideo(false));
            clearTimeout(timerRef.current);
          }
        }, 5000);
        video.play();
      }
    };

    if (videoIsPlay) {
      videoIsPlayFunc();
    } else {
      videoIsPauseFunc();
    }
  };

  const onTouchStart = () => {
    if (videoIsPlay) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      dispatch(toggleViewControlVideo(true));
    }
  };

  const onTouchEnd = () => {
    if (videoIsPlay) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        dispatch(toggleViewControlVideo(true));
        if (timerRef.current) {
          dispatch(toggleViewControlVideo(false));
          clearTimeout(timerRef.current);
        }
      }, 5000);
    }
  };

  const onVideoLoad: React.DOMAttributes<HTMLVideoElement>["onLoadedMetadata"] =
    () => {
      const video = videoRef.current;
      if (video) {
        dispatch(setVideoLength(video.duration));
      }
    };

  return (
    <>
      <div
        onTouchStart={onTouchStart}
        onMouseDown={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseUp={onTouchEnd}
        className={`${styles.container} container no-padding`}
      >
        <Video
          onLoadedMetadata={onVideoLoad}
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (video) {
              dispatch(setVideoCurTime(video.currentTime));
            }
          }}
          videoRef={videoRef}
          src={videoFile}
          className={styles.video}
        >
          <>
            <Control
              onClickPlay={handlePlayBtn}
              onSliderChange={(_, value) => {
                const video = videoRef.current;
                if (typeof value === "number" && video) {
                  dispatch(setVideoCurTime(value));
                  video.currentTime = value;
                }
              }}
            />
          </>
        </Video>
      </div>

      <ListEpisodes isOpen={openListEp} />
    </>
  );
};

export default FilmVideo;
