import styles from "./styles.module.scss";
import { ReactComponent as CardSVG } from "@icons/Card.svg";
import { AddCardInput } from "../../ui";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { ReactComponent as VisaSVG } from "@icons/VisaLogo.svg";
import { ReactComponent as MastercardSVG } from "@icons/MasterCardLogo.svg";
import { ReactComponent as MirSVG } from "@icons/MirLogo.svg";
export const NumberCardInput = forwardRef<
  HTMLInputElement,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
>(({ className, value, placeholder, ...restProps }, ref) => {
  const [cardType, setCardType] = useState<string | null>(null);

  const SwitchIcon = useMemo(() => {
    return () => {
      switch (cardType) {
        case "visa":
          return <VisaSVG className={styles.icon} />;
        case "mastercard":
          return <MastercardSVG className={styles.icon} />;
        case "mir":
          return <MirSVG className={styles.icon} />;

        default:
          return <CardSVG className={styles.icon} />;
      }
    };
  }, [cardType]);

  const handleInputChange = (value: string) => {
    let detectedCardType = null;

    // Проверка номера карты на соответствие типу
    if (value.startsWith("4") && value.length >= 6) {
      detectedCardType = "visa"; // Visa начинается с 4
    } else if (
      (value.startsWith("51") ||
        value.startsWith("52") ||
        value.startsWith("53") ||
        value.startsWith("54") ||
        value.startsWith("55")) &&
      value.length >= 6
    ) {
      detectedCardType = "mastercard"; // Mastercard начинается с 51-55
    } else if (value.startsWith("220") && value.length >= 6) {
      detectedCardType = "mir"; // Mir начинается с 220
    } else if (value.startsWith("9792") && value.length >= 6) {
      detectedCardType = "umoney"; // UMoney начинается с 9792
    }

    setCardType(detectedCardType);
  };

  useEffect(() => {
    handleInputChange(String(value));
  }, [value]);

  return (
    <AddCardInput
      placeholder={placeholder}
      maxLength={19}
      className={`${styles.input} ${className}`}
      ref={ref}
      type="tel"
      {...restProps}
    >
      <SwitchIcon />
      {restProps.children}
    </AddCardInput>
  );
});
