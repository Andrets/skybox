
import SearchInput from "@/reusable-in-pages/components/SearchInput/SearchInput";
import styles from "./styles.module.scss";
import { Outlet, useNavigate } from "react-router-dom";
export const StartPageLayout = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`container ${styles.container}`}>
        <SearchInput
          onClick={() => {
            navigate("/search");
          }}
        />
      </div>

      <Outlet />
    </>
  );
};
