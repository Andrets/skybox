import { FilmName, PlayButton } from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";

import { memo, useContext } from "react";
import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import { SideButtons } from "./SideButtons";
import { ControlProps } from "../../model/ControlProps";
import { VideoTimeSlider } from "./VideoTimeSlider";
import { LoaderSpinner } from "@/ui/Icons";
import { useAppSelector } from "@/shared/hooks/reduxTypes";

export const Control = memo(
  ({ isViewTimeSlider, ...restProps }: ControlProps) => {
    const { viewPlay, videoIsLoading } = useContext(ShortsItemContext);

    const activeShortsItemInfo = useAppSelector(
      (state) => state.shorts.activeShortsItemInfo
    );

    return (
      <div {...restProps} className={styles.control}>
        {viewPlay && (
          <PlayButton
            onMouseDown={restProps.onMouseDown}
            onTouchEnd={restProps.onTouchEnd}
            className={styles.playBtn}
            isPlay={false}
          />
        )}

        {videoIsLoading && !viewPlay && (
          <LoaderSpinner className={styles.loader} />
        )}

        <FilmName
          className={styles.film}
          name={activeShortsItemInfo?.serail_name}
          episode={
            activeShortsItemInfo?.episode ? activeShortsItemInfo?.episode : ""
          }
        />

        {isViewTimeSlider && (
          <>
            <VideoTimeSlider />
          </>
        )}

        <SideButtons />
      </div>
    );
  }
);
