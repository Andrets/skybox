import HorizontalScrollContainer from "@/reusable-in-pages/components/HorizontalScrollContainer/HorizontalScrollContainer";
import styles from "./styles.module.scss";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export const CategoryToggler = () => {
  return (
    <HorizontalScrollContainer className={styles.container}>
      <ToggleButtonGroup
        className={styles.btnGroup}
        exclusive
        aria-label="Category"
      >
        <ToggleButton
          className={`${styles.item} ${styles.active}`}
          value="Popular"
        >
          Popular
        </ToggleButton>

        <ToggleButton className={`${styles.item}`} value="New">
          New
        </ToggleButton>

        <ToggleButton className={`${styles.item}`} value="Original+">
          Original+
        </ToggleButton>

        <ToggleButton className={`${styles.item}`} value="Male">
          Male
        </ToggleButton>

        <ToggleButton className={`${styles.item}`} value="Female">
          Female
        </ToggleButton>
      </ToggleButtonGroup>
    </HorizontalScrollContainer>
  );
};

