import styles from "./styles.module.scss";
import { ReactComponent as VisaLogo } from "@icons/VisaLogo.svg";
import { ReactComponent as MasterCardLogo } from "@icons/MasterCardLogo.svg";
export const FooterInfo = () => {
  return (
    <div className={`container ${styles.container}`}>
      <p className={styles.text}>
        Платеж безопасен. CloudPayments — платежная система, сертифицированная
        PCI DSS
      </p>

      <div className={styles.logos}>
        <VisaLogo />
        <MasterCardLogo />
      </div>
    </div>
  );
};
