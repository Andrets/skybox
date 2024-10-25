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
  const [formValid, setFormValid] = useState(false);
  const { t } = useTranslation();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const { id } = useParams();
  const [addComment] = useCreateCommentMutation();
  const onChangeTextarea: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.target.value.length === 0) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  };

  const formSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (formValid && commentRef?.current?.value && id) {
      dispatch(
        filmInfoApiSlice.util.updateQueryData("getFilmInfo", id, (draft) => {
          if (draft.comments && userData) {
            draft.comments.push({
              tg_username: userData.tg_username,
              user_avatar: userData.photo,
              text: String(commentRef.current?.value),
            });
          }

          return draft;
        })
      );
      await addComment({
        serial_id: Number(id),
        text: commentRef.current?.value,
      });

      commentRef.current.value = "";
    }
  };
  return (
    <form onSubmit={formSubmit} className={styles.container}>
      <TextareaAutosize
        onChange={onChangeTextarea}
        ref={commentRef}
        placeholder={t("typeSomething")}
        className={styles.textarea}
      />

      <Button
        disabled={!formValid}
        className={styles.sendComment}
        type="submit"
      >
        {t("sendComment")}
      </Button>
    </form>
  );
};

export default AddComment;
