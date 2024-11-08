import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { ReactComponent as ClipsIcon } from "@icons/Clips.svg";
// import ClipsIcon from "@/ui/icons/clips/ClipsIcon";
import styles from "./styles.module.scss";
import { createPortal } from "react-dom";
import { ReactComponent as BookmarkIcon } from "@icons/BookmarkWidth.svg";
import { ReactComponent as ProfileIcon } from "@icons/Human.svg";
import { ReactComponent as HomeSVG } from "@icons/Home.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const BottomNavigationComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
              <>
                <HomeSVG
                  className={`${styles.icon} ${styles.home} ${
                    location.pathname === "/" && styles.active
                  }`}
                />

                <span
                  className={`${styles.text} ${
                    location.pathname === "/" && styles.active
                  } `}
                >
                  {t("bottomNavigation.home")}
                </span>
              </>
            }
          />
          <BottomNavigationAction
            className={`${styles.link} `}
            onClick={() => {
              navigate("/shorts");
            }}
            icon={
              <>
                <ClipsIcon
                  width={23}
                  height={23}
                  className={`${styles.clips} ${
                    location.pathname?.includes("shorts") && styles.active
                  }`}
                />
                <span
                  className={`${styles.text} ${
                    location.pathname?.includes("shorts") && styles.active
                  }`}
                >
                  {t("bottomNavigation.shorts")}
                </span>
              </>
            }
          />

          <BottomNavigationAction
            className={styles.link}
            onClick={() => {
              navigate("/likes");
            }}
            icon={
              <>
                <BookmarkIcon
                  width={15}
                  height={23}
                  className={`${styles.icon} ${styles.bookmark} ${
                    location.pathname.includes("likes") && styles.active
                  }`}
                />
                <span
                  className={`${styles.text} ${
                    location.pathname.includes("likes") && styles.active
                  }`}
                >
                  {t("bottomNavigation.liked")}
                </span>
              </>
            }
          />

          <BottomNavigationAction
            className={styles.link}
            onClick={() => {
              navigate("profile");
            }}
            icon={
              <>
                <ProfileIcon
                  width={23}
                  height={23}
                  className={`${styles.icon}  ${styles.profile} ${
                    location.pathname.includes("profile") && styles.active
                  }`}
                />
                <span
                  className={`${styles.text} ${
                    location.pathname.includes("profile") && styles.active
                  }`}
                >
                  {t("bottomNavigation.profile")}
                </span>
              </>
            }
          />
        </BottomNavigation>,
        document.body
      )}
    </>
  );
};

export default BottomNavigationComponent;
