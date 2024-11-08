import { Button, Drawer } from "@mui/material";
import styles from "./styles.module.scss";
import { SectionHeader } from "@/ui/SectionHeader";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { CommentsModalProps } from "./interface";
import AddComment from "./components/AddComment/AddComment";
import CommentsBlock from "./components/Comments/Comments";
import { useTranslation } from "react-i18next";

export const CommentsModal = ({
  onCloseClickBtn,
  open,
}: CommentsModalProps) => {
  const { t } = useTranslation();
  return (
    <Drawer
      sx={{ maxHeight: "60%" }}
      anchor="bottom"
      className={styles.container}
      open={open}
    >
      <div className={styles.headerCont}>
        <SectionHeader>{t("addComment")}</SectionHeader>
        <Button
          sx={{ minWidth: 0, padding: "0 12px" }}
          onClick={onCloseClickBtn}
          className={styles.closeBtn}
        >
          <CloseRoundedIcon sx={{ fill: "rgba(121, 120, 124, 1)" }} />
        </Button>
      </div>

      <AddComment />

      <SectionHeader className={styles.listCommentsHeader}>
        {t("comments")}
      </SectionHeader>

      <CommentsBlock />
    </Drawer>
  );
};
