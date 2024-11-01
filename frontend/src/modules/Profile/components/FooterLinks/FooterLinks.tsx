import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { LinkButton } from "@/ui/LinkButton/LinkButton";
import { useTranslation } from "react-i18next";
import { WebApp } from "@/shared/constants/constants";
import { ReactComponent as WalletSVG } from "@icons/Wallet.svg";
export const FooterLinks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickHelpBtn = () => {
    WebApp.openLink("https://t.me/eugenekrasnov", { try_instant_view: true });
  };

  const onClickSettings = () => {
    navigate("/settings");
  };

  const onClickPay = () => {
    navigate("/paySubscribe");
  };
  return (
    <div className={`${styles.container}`}>
      <div className="container">
        <LinkButton onClick={onClickPay} className={styles.linkPay}>
          <span className={styles.pay}>
            <WalletSVG className={styles.walletSVG} /> {t("paySubscribe")}
          </span>
        </LinkButton>
        <LinkButton
          onClick={onClickHelpBtn}
          className={styles.link}
          children={`${t("helpFeedback")}`}
        />
        <LinkButton
          onClick={onClickSettings}
          className={styles.link}
          children={`${t("settings")}`}
        />
      </div>
    </div>
  );
};
