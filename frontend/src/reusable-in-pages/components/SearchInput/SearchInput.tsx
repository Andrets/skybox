import { FC } from "react";
import styles from "./styles.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { SearchInputProps } from "./interface";
const SearchInput: FC<SearchInputProps> = ({
  className,
  iconClassName,
  inputClassName,
  onFocus,
  onBlur,
  onClick,
}) => {
  return (
    <label className={`${styles.container} ${className}`}>
      <SearchIcon
        sx={{ color: "var(--sub-text-color)" }}
        className={`${iconClassName}`}
      />
      <input
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        placeholder="Search..."
        className={`${inputClassName}`}
      />
    </label>
  );
};

export default SearchInput;
