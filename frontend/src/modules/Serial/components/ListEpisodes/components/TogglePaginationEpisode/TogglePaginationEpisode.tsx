import { ToggleButtonGroup, ToggleButtonOwnProps } from "@mui/material";
import styles from "./styles.module.scss";
import ToggleButtonPagination from "../../ui/ToggleButtonPagination";
import { TogglePaginationProps } from "../../model/TogglePaginationProps";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxTypes";
import { setPaginationPage } from "@/modules/Serial/slices/FilmVideoSlice";

export interface PaginationItem {
  start: number;
  end: number;
}

export const paginationItems = (numEpisodes: number) => {
  let i = 0;

  const arr: PaginationItem[] = [];

  while (i < numEpisodes) {
    let el: PaginationItem = {
      start: i + 1,
      end: Math.min(i + 30, numEpisodes),
    };
    i = i + 30;

    arr.push(el);
  }

  return arr;
};

const TogglePaginationEpisode = ({ numEpisodes }: TogglePaginationProps) => {
  const paginationPage = useAppSelector(
    (state) => state.filmVideo.paginationPage
  );

  const dispatch = useAppDispatch();

  const handleChangePage: ToggleButtonOwnProps["onChange"] = (_, value) => {
    if (value && !isNaN(value)) {
      dispatch(setPaginationPage(value));
    }
  };
  return (
    <ToggleButtonGroup className={styles.listPaginationGroup}>
      {paginationItems(numEpisodes).map((el, index) => {
        return (
          <ToggleButtonPagination
            key={index}
            className={styles.toggler}
            value={index}
            isActive={paginationPage === index}
            onChange={handleChangePage}
          >
            {el.start}-{el.end}
          </ToggleButtonPagination>
        );
      })}
    </ToggleButtonGroup>
  );
};

export default TogglePaginationEpisode;
