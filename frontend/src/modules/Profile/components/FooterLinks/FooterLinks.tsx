import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { LinkButton } from "@/ui/LinkButton/LinkButton";
export const FooterLinks = () => {
  const navigate = useNavigate();
  return (
    <div className={`${styles.container}`}>
      <div className="container">
        <LinkButton className={styles.link} name="Help & Feedback" />
        <LinkButton
          onClick={() => navigate("/settings")}
          className={styles.link}
          name="Settings"
        />
      </div>
    </div>
  );
};
