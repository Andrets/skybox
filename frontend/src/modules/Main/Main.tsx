import { FC } from "react";
import styles from "./styles.module.scss";
import {
  CategoryListFilm,
  CategoryToggler,
  ExclusiveOriginals,
  RecomendationList,
} from "./components";
import { SectionHeader } from "@/ui/SectionHeader";

const Main: FC = () => {
  return (
    <>
      <div className={`${styles.container}`}>
        <div style={{ padding: 0 }} className="container">
          <CategoryToggler />
          <CategoryListFilm films={[]} />
        </div>

        <SectionHeader className={`${styles.originalsSectHeader} container`}>
          Exclusive originals
        </SectionHeader>

        <div style={{ padding: "0 0 0 12px" }} className="container">
          <ExclusiveOriginals />
        </div>

        <SectionHeader className={`${styles.originalsSectHeader} container`}>
          You might like
        </SectionHeader>

        <RecomendationList />
      </div>
    </>
  );
};

export default Main;
