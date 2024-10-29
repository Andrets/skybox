import styles from "./styles.module.scss";
import { SectionHeader } from "@/ui/SectionHeader";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button } from "@mui/material";
import { HeaderProps } from "../../model/HeaderProps";
import { FC } from "react";
import { useGetFilmInfoQuery } from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";
const Header: FC<HeaderProps> = ({ onClose }) => {
  const { id } = useParams();
  const { data } = useGetFilmInfoQuery(id ? id : "", {
    skip: id ? false : true,
  });

  return (
    <div className={styles.top}>
      <SectionHeader>{data?.name}</SectionHeader>
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
