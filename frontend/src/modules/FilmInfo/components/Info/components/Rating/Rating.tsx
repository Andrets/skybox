import { Rating } from "@mui/material";
import styles from "./styles.module.scss";
import { filmInfoApiSlice, useUpdateRatingMutation } from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";

export const RatingFilm = ({ rating }: { rating: number | null }) => {
  const [updateRatingQuery] = useUpdateRatingMutation();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  //   const { data } = useGetFilmInfoQuery(String(id));
  return (
    <div className={styles.container}>
      <Rating
        size="large"
        precision={1}
        className={styles.rating}
        readOnly={rating !== null}
        value={rating ? rating : 0}
        onChange={(_, value) => {
          if (value) {
            if (id) {
              dispatch(
                filmInfoApiSlice.util.updateQueryData(
                  "getFilmInfo",
                  id,
                  (draft) => {
                    draft.user_rating = value;

                    return draft
                  }
                )
              );
              updateRatingQuery({ serail_id: parseInt(id), rating: value });
            }
          }
        }}
      />
    </div>
  );
};
