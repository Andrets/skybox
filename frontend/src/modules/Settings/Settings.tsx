import useBackButton from "@/shared/hooks/useBackButton";
import { SettingsLinkList } from "./components";

const Settings = () => {
  useBackButton();
  return (
    <>
      <SettingsLinkList />
    </>
  );
};

export default Settings;
