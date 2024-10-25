import styles from "./styles.module.scss";
import { SectionHeader } from "@/ui/SectionHeader";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button } from "@mui/material";
import { HeaderProps } from "../../model/HeaderProps";
import { FC } from "react";
const Header: FC<HeaderProps> = ({ onClose }) => {
  return (
    <div className={styles.top}>
      <SectionHeader>Falling In Love with the Rascue</SectionHeader>
      <Button
        sx={{ minWidth: 0, padding: "0 12px" }}
        onClick={onClose}
        className={styles.closeBtn}
      >
        <CloseRoundedIcon sx={{ fill: "rgba(121, 120, 124, 1)" }} />
      </Button>
    </div>
  );
};

export default Header;
