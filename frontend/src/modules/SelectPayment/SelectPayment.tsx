import { SelectPaymentItem } from "./components";
import { ReactComponent as MirSVG } from "@icons/MirLogo.svg";
import styles from "./styles.module.scss";
import { LinkButton } from "@/ui/LinkButton/LinkButton";
import { useNavigate } from "react-router-dom";
export const SelectPayment = () => {
  const navigate = useNavigate();
  return (
    <div className={`${styles.container} container`}>
      <SelectPaymentItem
        className={styles.selectItem}
        icon={<MirSVG />}
        titleText="Мир"
        subtitleText="Банковская карта"
        isActive={true}
      />

      <SelectPaymentItem
        className={styles.selectItem}
        icon={<MirSVG />}
        titleText="Мир"
        subtitleText="Банковская карта"
        isActive={false}
      />

      <SelectPaymentItem
        className={styles.selectItem}
        icon={<MirSVG />}
        titleText="Мир"
        subtitleText="Банковская карта"
        isActive={false}
      />

      <LinkButton
        onClick={() => {
          navigate("/addCard");
        }}
        className={styles.link}
        children="Добавить карту"
      />
    </div>
  );
};
