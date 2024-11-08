import { TextareaAutosize, Button } from "@mui/material";
import styles from "./styles.module.scss";
import { FormEventHandler, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { filmInfoApiSlice, useCreateCommentMutation } from "@/api/FilmInfoApi";
import { useParams } from "react-router-dom";

import { useAuthorizationQuery } from "@/api/userApi";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
const AddComment = () => {
  const dispatch = useAppDispatch();
  const { data: userData } = useAuthorizationQuery();
  const [commentText, setCommentText] = useState("");
  const { t } = useTranslation();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const { id } = useParams();
  const [addComment] = useCreateCommentMutation();
  const onChangeTextarea: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    setCommentText(e.target.value);
  };

  const formSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (commentText.length > 0 && id) {
      dispatch(
        filmInfoApiSlice.util.updateQueryData(
          "getFilmComments",
          id,
          (draft) => {
            if (draft && userData) {
              draft.unshift({
                tg_username: userData.tg_username,
                user_avatar: userData.photo,
                text: commentText,
              });
            }

            return draft;
          }
        )
      );
      setCommentText("");
      await addComment({
        serial_id: Number(id),
        text: commentText,
      });
    }
  };
  return (
    <form onSubmit={formSubmit} className={styles.container}>
      <TextareaAutosize
        onChange={onChangeTextarea}
        ref={commentRef}
        placeholder={t("typeSomething")}
        value={commentText}
        className={styles.textarea}
      />

      <Button
        disabled={commentText.length === 0}
        className={styles.sendComment}
        type="submit"
      >
        {t("sendComment")}
      </Button>
    </form>
  );
};

export default AddComment;
