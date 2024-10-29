import styles from "./styles.module.scss";
// import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { FilmName, PlayButton } from "@/reusable-in-pages/components/Video";
import { SerialControlProps } from "@/reusable-in-pages/components/Video/models/ControlProps";
import SideButtons from "../../ui/SideButtons/SideButtons";
import { useContext } from "react";
import { VideoSeriesItemContext } from "@/reusable-in-pages/contexts/VideoSeriesItemContext/context";
import { useParams } from "react-router-dom";
import { useGetFilmInfoQuery } from "@/api/FilmInfoApi";
export const Control = ({
  onClickPlay,
  isPlaying = false,
  episode,
  ...restProps
}: SerialControlProps) => {
  const { videoIsLoading } = useContext(VideoSeriesItemContext);
  const { id } = useParams();
  const { data: filmInfoData } = useGetFilmInfoQuery(id ? id : "", {
    skip: id ? false : true,
  });

  console.log("hhhh", filmInfoData?.name);
  return (
    <>
      <div {...restProps} className={styles.control}>
        {!videoIsLoading && (
          <PlayButton
            isPlay={isPlaying}
            onClick={onClickPlay}
            className={styles.playBtn}
          />
        )}

        <SideButtons />

        <FilmName
          className={styles.name}
          name={filmInfoData?.name ? filmInfoData?.name : ""}
          episode={episode}
        />
      </div>
    </>
  );
};
