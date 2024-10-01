import styles from "./styles.module.scss";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { FC} from "react";
import { ClipsIconProps } from "./interface";
const ClipsIcon: FC<ClipsIconProps> = ({
  className,
  mainRectClassname,
  backRectClassName,
  svgMainRectClassName,
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.rect} ${mainRectClassname}`}>
        <PlayArrowRoundedIcon className={svgMainRectClassName} />
      </div>

      <div className={`${styles.rect} ${styles.bg} ${backRectClassName}`}></div>
    </div>
  );
};

export default ClipsIcon;
