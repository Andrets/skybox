import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { ReactComponent as EarthIcon } from "@icons/Earth.svg";
import { ReactComponent as ClipsIcon } from "@icons/Clips.svg";
// import ClipsIcon from "@/ui/icons/clips/ClipsIcon";
import styles from "./styles.module.scss";
import { createPortal } from "react-dom";
import { ReactComponent as BookmarkIcon } from "@icons/BookmarkWidth.svg";
import { ReactComponent as ProfileIcon } from "@icons/Human.svg";
import { useNavigate } from "react-router-dom";
import { useCurrentPath } from "@/shared/hooks/useCurrentPath";
const BottomNavigationComponent = () => {
  const navigate = useNavigate();
  const curLocation = useCurrentPath();

  console.log("ccc", curLocation);
  return (
    <>
      {createPortal(
        <BottomNavigation className={styles.container} showLabels={false}>
          <BottomNavigationAction
            className={styles.link}
            onClick={() => {
              navigate("/");
            }}
            icon={
              <EarthIcon
                className={`${styles.icon} ${styles.home} ${
                  curLocation === "" && styles.active
                }`}
              />
            }
          />
          <BottomNavigationAction
            className={`${styles.link} `}
            onClick={() => {
              navigate("/shorts");
            }}
            icon={
              <ClipsIcon
                className={`${styles.clips} ${
                  curLocation?.includes("shorts") && styles.active
                }`}
              />
            }
          />

          <BottomNavigationAction
            className={styles.link}
            onClick={() => {
              navigate("/likes");
            }}
            icon={
              <BookmarkIcon
                className={`${styles.icon} ${styles.bookmark} ${
                  curLocation === "likes" && styles.active
                }`}
              />
            }
          />

          <BottomNavigationAction
            className={styles.link}
            onClick={() => {
              navigate("profile");
            }}
            icon={
              <ProfileIcon
                className={`${styles.icon}  ${styles.profile} ${
                  curLocation === "profile" && styles.active
                }`}
              />
            }
          />
        </BottomNavigation>,
        document.body
      )}
    </>
  );
};

export default BottomNavigationComponent;
