import { FC } from "react";
import styles from "./styles.module.scss";
import {
  CategoryListFilm,
  CategoryToggler,
  ExclusiveOriginals,
  RecomendationList,
} from "./components";
import { SectionHeader } from "@/ui/SectionHeader";
import { useTranslation } from "react-i18next";
import useBackButton from "@/shared/hooks/useBackButton";

const Main: FC = () => {
  const { t } = useTranslation();
  useBackButton(undefined, false);
  return (
    <>
      <div className={`${styles.container}`}>
        <CategoryToggler />
        <div style={{ padding: 0 }} className={`container ${styles.topCont}`}>
          <CategoryListFilm />
        </div>

        <SectionHeader className={`${styles.originalsSectHeader} container`}>
          {t("exclusiveOriginals")}
        </SectionHeader>

        <div style={{ padding: "0 0 0 12px" }} className="container">
          <ExclusiveOriginals />
        </div>

        <SectionHeader className={`${styles.originalsSectHeader} container`}>
          {t("youMightLike")}
        </SectionHeader>

        <RecomendationList />
      </div>
    </>
  );
};

export default Main;
