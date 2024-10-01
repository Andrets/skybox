import { FilmName, PlayButton } from "@/reusable-in-pages/components/Video";
import styles from "./styles.module.scss";

import { memo, useContext } from "react";
import { ShortsItemContext } from "@/reusable-in-pages/contexts/ShortsContext/context";
import { SideButtons } from "./SideButtons";
import { ControlProps } from "../../model/ControlProps";
import { VideoTimeSlider } from "./VideoTimeSlider";

export const Control = memo(
  ({ isViewTimeSlider, ...restProps }: ControlProps) => {
    const { isPlaying, viewPlay } = useContext(ShortsItemContext);

    return (
      <div {...restProps} className={styles.control}>
        {viewPlay && (
          <PlayButton className={styles.playBtn} isPlay={isPlaying} />
        )}

        <FilmName
          className={styles.film}
          name={"Love the way you lie"}
          episode={1}
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
