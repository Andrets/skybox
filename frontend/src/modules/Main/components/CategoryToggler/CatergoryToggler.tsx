import HorizontalScrollContainer from "@/reusable-in-pages/components/HorizontalScrollContainer/HorizontalScrollContainer";
import styles from "./styles.module.scss";
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonOwnProps,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { setActiveCategory } from "../../slices/MainSlice";
import { ExclusiveOriginalsSearchParams } from "@/shared/models/MainPageApi";

const CATEGORIES = [
  { value: ExclusiveOriginalsSearchParams.popular, children: "Popular" },
  { value: ExclusiveOriginalsSearchParams.new, children: "New" },
  { value: ExclusiveOriginalsSearchParams.original, children: "Original" },
  { value: ExclusiveOriginalsSearchParams.male, children: "Male" },
  { value: ExclusiveOriginalsSearchParams.female, children: "Female" },
];

export const CategoryToggler = () => {
  const activeCategory = useAppSelector(
    (state) => state.mainSlice.activeCategory
  );
  const dispatch = useAppDispatch();
  const handleOnChange: ToggleButtonOwnProps["onChange"] = (e, value) => {
    e.preventDefault();
    dispatch(setActiveCategory(value));
  };
  return (
    <HorizontalScrollContainer className={styles.container}>
      <ToggleButtonGroup
        className={styles.btnGroup}
        exclusive
        aria-label="Category"
      >
        {CATEGORIES.map((el, index) => {
          return (
            <ToggleButton
              key={index}
              className={`${styles.item} ${
                el.value === activeCategory && styles.active
              }`}
              onChange={handleOnChange}
              value={el.value}
            >
              {el.children}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </HorizontalScrollContainer>
  );
};
