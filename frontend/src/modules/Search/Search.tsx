import useBackButton from "@/shared/hooks/useBackButton";

import { ExploreList, Result } from "./components";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
const Search = () => {
  const navigate = useNavigate();
  useBackButton(() => {
    navigate(-1);
  });
  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.content}>
        <ExploreList />
        <Result />
      </div>
    </div>
  );
};

export default Search;
