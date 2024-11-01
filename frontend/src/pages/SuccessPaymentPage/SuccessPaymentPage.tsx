import { Button } from "@mui/material";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const SuccessPaymentPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className={`container ${styles.container}`}>
      <span>{t("paymentSuccess")}</span>
      <Button onClick={() => navigate("/")} className={styles.backButton}>
        {t("backToHome")}
      </Button>
    </div>
  );
};
