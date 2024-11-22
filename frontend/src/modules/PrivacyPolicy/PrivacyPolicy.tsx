import { useAuthorizationQuery } from "@/api/userApi";
import styles from "./styles.module.scss";

import useBackButton from "@/shared/hooks/useBackButton";
import {
  PrivacyPolicyAr,
  PrivacyPolicyEn,
  PrivacyPolicyKo,
  PrivacyPolicyRu,
  PrivacyPolicyTr,
  PrivacyPolicyZh,
} from "./trans";

const c = {
  ru: <PrivacyPolicyRu />,
  ar: <PrivacyPolicyAr />,
  en: <PrivacyPolicyEn />,
  ko: <PrivacyPolicyKo />,
  tr: <PrivacyPolicyTr />,
  zh: <PrivacyPolicyZh />,
};
const PrivacyPolicy = () => {
  const { data } = useAuthorizationQuery();
  useBackButton();

  return (
    <div className={`container ${styles.container}`}>
      {" "}
      {data && data.lang ? c[data.lang] : c.ru}
    </div>
  );
};

export default PrivacyPolicy;
