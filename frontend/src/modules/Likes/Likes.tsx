import { SectionHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";
import { LikeItem } from "./ui";
import posterIMG from "@images/poster.png";

const Likes = () => {
  return (
    <div className={`container`}>
      <SectionHeader className={styles.header}>My list</SectionHeader>

      <div className={styles.list}>
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
        <LikeItem poster={posterIMG} to={""} name="My Gigolo Husband: Themes" />
      </div>
    </div>
  );
};

export default Likes;
