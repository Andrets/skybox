import { Avatar } from "@mui/material";
import styles from "./styles.module.scss";
import { WebApp } from "@/shared/constants/constants";
import { useAuthorizationQuery } from "@/api/userApi";
export const ProfileInfo = () => {
  const { data } = useAuthorizationQuery();
  return (
    <div>
      <div className={`${styles.container} container `}>
        <Avatar src={data?.photo} className={styles.avatar} />

        <div className={styles.info}>
          <p className={styles.name}>
            {WebApp.initDataUnsafe.user?.first_name}{" "}
            {WebApp.initDataUnsafe.user?.last_name}
          </p>
          <p className={styles.id}>ID {WebApp.initDataUnsafe.user?.id}</p>
        </div>
      </div>
    </div>
  );
};
