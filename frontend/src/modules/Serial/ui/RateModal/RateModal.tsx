import { Modal, Rating } from "@mui/material";
import styles from "./styles.module.scss";
import { SectionHeader } from "@/ui/SectionHeader";
import { RateModalProps } from "./interface";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  filmInfoApiSlice,
  useGetFilmInfoQuery,
  useUpdateRatingMutation,
} from "@/api/FilmInfoApi";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";

export const RateModal = (props: RateModalProps) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: filmInfoData } = useGetFilmInfoQuery(id ? id : "", {
    skip: id ? false : true,
  });
  const dispatch = useAppDispatch();
  const [updateRatingQuery] = useUpdateRatingMutation();
  return (
    <Modal
      onClose={props.onClose}
      open={props.open}
      className={`${styles.cont} ${props.className}`}
    >
      <div className={styles.childrenCont}>
        <SectionHeader className={styles.header}>{t("rateFilm")}</SectionHeader>

        <Rating
          defaultValue={
            filmInfoData?.user_rating ? filmInfoData?.user_rating : 0
          }
          value={filmInfoData?.user_rating ? filmInfoData?.user_rating : 0}
          onChange={(_, value) => {
            if (value && id) {
              dispatch(
                filmInfoApiSlice.util.updateQueryData(
                  "getFilmInfo",
                  id ? id : "",
                  (draft) => {
                    draft.user_rating = value;
                    return draft;
                  }
                )
              );

              updateRatingQuery({ serail_id: parseInt(id), rating: value });
            }
          }}
          size="large"
          precision={1}
          className={styles.rating}
        />
      </div>
    </Modal>
  );
};
