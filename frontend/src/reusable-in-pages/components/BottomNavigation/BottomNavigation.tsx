import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { ReactComponent as EarthIcon } from "@icons/Earth.svg";
import { ReactComponent as ClipsIcon } from "@icons/Clips.svg";
// import ClipsIcon from "@/ui/icons/clips/ClipsIcon";
import styles from "./styles.module.scss";
import { createPortal } from "react-dom";
import { ReactComponent as BookmarkIcon } from "@icons/BookmarkWidth.svg";
import { ReactComponent as ProfileIcon } from "@icons/Human.svg";
import { useLocation, useNavigate } from "react-router-dom";
const BottomNavigationComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
                  location.pathname === "/" && styles.active
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
                  location.pathname?.includes("shorts") && styles.active
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
                  location.pathname.includes("likes") && styles.active
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
                  location.pathname.includes("profile") && styles.active
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
