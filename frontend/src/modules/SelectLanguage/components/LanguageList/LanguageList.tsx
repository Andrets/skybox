import { LANGUAGESLIST } from "@/shared/constants/constants";
import { useLanguageList } from "../../hooks/useLanguageList";
import { OptionLanguage } from "../../ui";
import styles from "./styles.module.scss";
import {
  useAuthorizationQuery,
  useChangeUserLangMutation,
  userApiSlice,
} from "@/api/userApi";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import i18n from "@/app/locales/i18n";

export const LanguageList = () => {
  const { data } = useAuthorizationQuery();
  const [changeLangQuery] = useChangeUserLangMutation();
  const languages_list = useLanguageList();
  const dispatch = useAppDispatch();

  const onHandleLanguage =
    (value: LANGUAGESLIST) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const changeLanguageFetch = async () => {
        i18n.changeLanguage(value);
        dispatch(
          userApiSlice.util.updateQueryData(
            "authorization",
            undefined,
            (draft) => {
              draft.lang = value;
              return draft;
            }
          )
        );
        await changeLangQuery(value);
      };

      changeLanguageFetch();
    };
  return (
    <div className={`container ${styles.container}`}>
      {languages_list.map((el, index) => {
        return (
          <OptionLanguage
            key={index}
            title={el.title}
            subtitle={el.subtitle}
            isActive={data?.lang === el.value}
            onClick={onHandleLanguage(el.value)}
            disabled={data?.lang === el.value}
          />
        );
      })}
    </div>
  );
};
