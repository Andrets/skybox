import { SettingsHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useBackButton from "@/shared/hooks/useBackButton";
import { useTranslation } from "react-i18next";

export const SettingsLayout = () => {
  useBackButton(() => {
    navigate(-1);
  });
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const textHeader = () => {
    switch (pathname) {
      case "/settings":
        return t("settings");
      case "/lang":
        return t("language");
      case "/termsofuse":
        return t("termsOfUse");
      case "/dmca":
        return t("dmca");
      case "/privacyPolicy":
        return t("privacyPolicy");
      case "/paySubscribe":
        return t("payment");
      default:
        return "";
    }
  };

  return (
    <>
      <SettingsHeader className={`${styles.container} container`}>
        {textHeader()}
      </SettingsHeader>

      <Outlet />
    </>
  );
};
