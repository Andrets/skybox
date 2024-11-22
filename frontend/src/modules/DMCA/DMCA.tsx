import { useAuthorizationQuery } from "@/api/userApi";
import { DMCAAr, DMCAEn, DMCAKo, DMCAru, DMCATr } from "./DMCAru";
import styles from "./styles.module.scss";

const c = {
  ru: <DMCAru />,
  ar: <DMCAAr />,
  en: <DMCAEn />,
  ko: <DMCAKo />,
  tr: <DMCATr />,
  zh: <DMCATr />,
};
export const DMCA = () => {
  const { data } = useAuthorizationQuery();
  return (
    <div className={`container ${styles.container}`}>
      {data && data.lang ? c[data.lang] : <DMCAru />}
    </div>
  );
};
