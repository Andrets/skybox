import { SectionHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";
import { LikeItem } from "./ui";
import posterIMG from "@images/poster.png";
import { useTranslation } from "react-i18next";

const Likes = () => {
  const { t } = useTranslation();
  return (
    <div className={`container`}>
      <SectionHeader className={styles.header}>{t("myList")}</SectionHeader>

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
