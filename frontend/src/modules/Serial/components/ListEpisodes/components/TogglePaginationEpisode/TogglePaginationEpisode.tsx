import { ToggleButtonGroup } from "@mui/material";
import styles from "./styles.module.scss";
import ToggleButtonPagination from "../../ui/ToggleButtonPagination";

const TogglePaginationEpisode = () => {
  return (
    <ToggleButtonGroup className={styles.listPaginationGroup}>
      <ToggleButtonPagination className={styles.toggler} value={1} isActive>
        1-30
      </ToggleButtonPagination>

      <ToggleButtonPagination
        className={styles.toggler}
        isActive={false}
        value={2}
      >
        31-56
      </ToggleButtonPagination>
    </ToggleButtonGroup>
  );
};

export default TogglePaginationEpisode;
