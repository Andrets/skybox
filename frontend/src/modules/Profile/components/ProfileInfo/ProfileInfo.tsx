import { Avatar } from "@mui/material";
import styles from "./styles.module.scss";
import posterIMG from "@images/poster.png";
export const ProfileInfo = () => {
  return (
    <div >
      <div className={`${styles.container} container `}>
        <Avatar src={posterIMG} className={styles.avatar} />

        <div className={styles.info}>
          <p className={styles.name}>Konstantin Konstantinopolsky</p>
          <p className={styles.id}>ID 88183192</p>
        </div>
      </div>
    </div>
  );
};
