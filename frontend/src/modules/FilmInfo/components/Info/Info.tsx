import styles from "./styles.module.scss";
import MainInfo from "../../MainInfo/MainInfo";
import { SectionHeader } from "@/ui/SectionHeader";
import CommentsBlock from "@/modules/FilmInfo/Comments/Comments";
import AddComment from "@/modules/FilmInfo/AddComment/AddComment";
import { ReactComponent as PlaySVG } from "@icons/Play.svg";
import { Link } from "react-router-dom";

const Info = () => {
  return (
    <div className={`${styles.info}`}>
      <div className={styles.container}>
        <MainInfo />

        <SectionHeader className={styles.sectHeader}>Comments</SectionHeader>

        <CommentsBlock />

        <SectionHeader className={styles.sectHeader}>Add comment</SectionHeader>

        <AddComment />

        <Link to={"/filmVideo"} className={` ${styles.link}`}>
          <PlaySVG /> Watch
        </Link>
      </div>
    </div>
  );
};

export default Info;
