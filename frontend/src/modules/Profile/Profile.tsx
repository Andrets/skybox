import useBackButton from "@/shared/hooks/useBackButton";
import { FooterLinks, ProfileInfo, WatchHistory } from "./components";

// import styles from "./styles.module.scss";
const Profile = () => {
  useBackButton();
  return (
    <>
      <ProfileInfo />
      <WatchHistory />
      <FooterLinks />
    </>
  );
};

export default Profile;
