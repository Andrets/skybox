import AttentionMark from "@/ui/marks/Attention/AttentionMark";
import { InfoProps } from "./interface";
import styles from "./styles.module.scss";
import { FC } from "react";
const Info: FC<InfoProps> = ({ header, status }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>{header}</div>
      {status && (
        <AttentionMark className={styles.status}>{status}</AttentionMark>
      )}
    </div>
  );
};

export default Info;
