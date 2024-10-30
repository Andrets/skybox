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
import { useTranslation } from "react-i18next";

export const CategoryToggler = () => {
  const activeCategory = useAppSelector(
    (state) => state.mainSlice.activeCategory
  );
  const dispatch = useAppDispatch();
  const handleOnChange: ToggleButtonOwnProps["onChange"] = (e, value) => {
    e.preventDefault();
    dispatch(setActiveCategory(value));
  };

  const { t } = useTranslation();

  const categoriesList = () => {
    return [
      {
        value: ExclusiveOriginalsSearchParams.popular,
        children: t("categoryToggler.popular"),
      },
      {
        value: ExclusiveOriginalsSearchParams.new,
        children: t("categoryToggler.new"),
      },
      {
        value: ExclusiveOriginalsSearchParams.original,
        children: t("categoryToggler.original"),
      },
      {
        value: ExclusiveOriginalsSearchParams.men,
        children: t("categoryToggler.male"),
      },
      {
        value: ExclusiveOriginalsSearchParams.women,
        children: t("categoryToggler.female"),
      },
    ];
  };

  return (
    <HorizontalScrollContainer className={`${styles.container} container`}>
      <ToggleButtonGroup
        className={styles.btnGroup}
        exclusive
        aria-label="Category"
      >
        {categoriesList().map((el, index) => {
          return (
            <ToggleButton
              key={index}
              sx={{ maxWidth: undefined }}
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
