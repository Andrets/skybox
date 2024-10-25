import { FC } from "react";
import styles from "./styles.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { SearchInputProps } from "./interface";
import { useTranslation } from "react-i18next";
const SearchInput: FC<SearchInputProps> = ({
  className,
  iconClassName,
  inputClassName,
  onFocus,
  onBlur,
  onClick,
  onChange,
  value,
}) => {
  const { t } = useTranslation();
  return (
    <label className={`${styles.container} ${className}`}>
      <SearchIcon
        sx={{ color: "var(--sub-text-color)" }}
        className={`${iconClassName}`}
      />
      <input
        type={"input"}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        placeholder={`${t("search")}...`}
        className={`${inputClassName}`}
        onChange={onChange}
        value={value}
      />
    </label>
  );
};

export default SearchInput;
