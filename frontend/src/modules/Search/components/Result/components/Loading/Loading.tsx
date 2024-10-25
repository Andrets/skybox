import { LoaderSpinner } from "@/ui/Icons";
import { Layout } from "../../ui";
import styles from "./styles.module.scss";

export const Loading = () => {
  return (
    <Layout childContainerClassName={styles.container}>
      <LoaderSpinner />
    </Layout>
  );
};
