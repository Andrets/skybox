import { useAuthorizationQuery } from "@/api/userApi";
import styles from "./styles.module.scss";
import useBackButton from "@/shared/hooks/useBackButton";
import {
  TermsOfUseAr,
  TermsOfUseEn,
  TermsOfUseKo,
  TermsOfUseRU,
  TermsOfUseTr,
  TermsOfUseZh,
} from "./trans";

const c = {
  ru: <TermsOfUseRU />,
  ar: <TermsOfUseAr />,
  en: <TermsOfUseEn />,
  ko: <TermsOfUseKo />,
  tr: <TermsOfUseTr />,
  zh: <TermsOfUseZh />,
};
export const TermsOfUse = () => {
  useBackButton();
  const { data } = useAuthorizationQuery();

  return (
    <div className={`container ${styles.container}`}>
      {data && data.lang ? c[data.lang] : c.ru}
    </div>
  );
};
