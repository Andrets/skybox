import useBackButton from "@/shared/hooks/useBackButton";
import { LanguageList } from "./components";

const SelectLanguage = () => {
  useBackButton();
  return (
    <>
      <LanguageList />
    </>
  );
};

export default SelectLanguage;
