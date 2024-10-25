import SearchInput from "@/reusable-in-pages/components/SearchInput/SearchInput";
import styles from "./styles.module.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import {
  setSearchInput,
  setSearchQueryValue,
} from "@/reusable-in-pages/slices/SearchFormSlice";
import { ChangeEventHandler, FormEventHandler } from "react";
import { searchApiSlice, useLazySearchQuery } from "@/api/SearchApi";
import { TransformHistoryResponseItem } from "@/shared/models/SearchApi";
import { isIncludeValue } from "./helpers/helpers";

export const StartPageLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const searchValue = useAppSelector((state) => state.searchInput.searchInput);
  const [searchQuery] = useLazySearchQuery();

  const onChangeInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(setSearchInput(e.target.value));
  };

  const onClickInput = () => {
    navigate("/search");
  };

  const searchFunction = async () => {
    await searchQuery(searchValue);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    dispatch(setSearchQueryValue(searchValue));
    searchFunction();
    dispatch(
      searchApiSlice.util.updateQueryData(
        "getSearchHistory",
        undefined,
        (draft) => {
          if (!isIncludeValue(draft, searchValue)) {
            let el: TransformHistoryResponseItem = {
              id: Math.random(),
              value: searchValue,
            };
            draft.unshift(el);

            if (draft.length > 10) {
              draft.pop();
            }
            return draft;
          }
        }
      )
    );
  };
  return (
    <>
      <form onSubmit={onSubmit} className={`container ${styles.container}`}>
        <SearchInput
          value={searchValue}
          onChange={onChangeInput}
          onClick={onClickInput}
        />
      </form>

      <Outlet />
    </>
  );
};
