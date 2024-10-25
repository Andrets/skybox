import styles from "./styles.module.scss";
// import { useAppSelector } from "@/shared/hooks/reduxTypes";
import { FilmName, PlayButton } from "@/reusable-in-pages/components/Video";
import { ControlProps } from "@/reusable-in-pages/components/Video/models/ControlProps";
import SideButtons from "./ui/SideButtons/SideButtons";
export const Control = ({
  onClickPlay,
  isPlaying = false,
  ...restProps
}: ControlProps) => {


  return (
    <>

        <div {...restProps} className={styles.control}>
          <PlayButton
            isPlay={isPlaying}
            onClick={onClickPlay}
            className={styles.playBtn}
          />
          <SideButtons />

          <FilmName
            className={styles.name}
            name={"Love the way you lie"}
            episode={1}
          />
        </div>
  
    </>
  );
};
