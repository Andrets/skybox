import { TextareaAutosize, Button } from "@mui/material";
import styles from "./styles.module.scss";
import { useRef, useState } from "react";
const AddComment = () => {
  const [formValid, setFormValid] = useState(false);

  const commentRef = useRef<HTMLTextAreaElement>(null);

  const onChangeTextarea: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.target.value.length === 0) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className={styles.container}
    >
      <TextareaAutosize
        onChange={onChangeTextarea}
        ref={commentRef}
        placeholder="Type something..."
        className={styles.textarea}
      />

      <Button
        disabled={!formValid}
        className={styles.sendComment}
        type="submit"
      >
        Send comment
      </Button>
    </form>
  );
};

export default AddComment;
