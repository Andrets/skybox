import { Rating } from "@mui/material";
import { useState } from "react";
import styles from "./styles.module.scss";
import {
  //   useGetFilmInfoQuery,
  useUpdateRatingMutation,
} from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";

export const RatingFilm = () => {
  const [value, setValue] = useState(0);
  const [updateRatingQuery] = useUpdateRatingMutation();
  const { id } = useParams();

  //   const { data } = useGetFilmInfoQuery(String(id));
  return (
    <div className={styles.container}>
      <Rating
        size="large"
        precision={1}
        className={styles.rating}
        value={value}
        onChange={(_, value) => {
          if (value) {
            setValue(value);
            if (id) {
              updateRatingQuery({ serail_id: parseInt(id), rating: value });
            }
          }
        }}
      />
    </div>
  );
};
