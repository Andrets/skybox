import { FilmName, PlayButton } from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";

import { memo, useContext } from "react";
import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import { SideButtons } from "./SideButtons";
import { ControlProps } from "../../model/ControlProps";
import { VideoTimeSlider } from "./VideoTimeSlider";
import { LoaderSpinner } from "@/ui/Icons";

export const Control = memo(
  ({
    isViewTimeSlider,
    name,
    is_liked,
    likes,
    episode,
    shorts_id,
    serail_id,
    ...restProps
  }: ControlProps) => {
    const { viewPlay, videoIsLoading } = useContext(ShortsItemContext);

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

        <FilmName className={styles.film} name={name} episode={episode} />

        {isViewTimeSlider && (
          <>
            <VideoTimeSlider />
          </>
        )}

        <SideButtons
          serail_id={serail_id}
          id={shorts_id}
          likes={likes}
          is_liked={is_liked}
        />
      </div>
    );
  }
);
