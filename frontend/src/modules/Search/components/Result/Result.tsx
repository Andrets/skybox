import { SectionHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";

import posterIMG from "@images/poster.png";
import { ResultItem } from "../../ui";
import { IPeopleSearchingItem } from "../../ui/PeopleSerchingItem/interface";

const psi: IPeopleSearchingItem = {
  poster: posterIMG,
  status: "New",
  category: "Family",
  description: `Single mom Caroline dumped her first love Easton Black eight years ago... But she never told him he got herpregnant!...`,
  header: `In The Name of Motherhood`,
};

const LIST = [psi, psi, psi];
export const Result = () => {
  return (
    <>
      <SectionHeader className={`${styles.header} ${styles.section} container`}>
        Results
      </SectionHeader>

      <div className={styles.list}>
        {LIST.map((el, index) => {
          return (
            <ResultItem
              key={index}
              poster={el.poster}
              header={el.header}
              category={el.category}
              status={el.status}
              description={el.description}
            />
          );
        })}
      </div>
    </>
  );
};
