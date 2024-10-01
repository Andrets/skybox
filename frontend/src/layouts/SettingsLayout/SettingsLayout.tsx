import { SettingsHeader } from "@/ui/SectionHeader";
import styles from "./styles.module.scss";
import { Outlet, useNavigate } from "react-router-dom";
import useBackButton from "@/shared/hooks/useBackButton";

export const SettingsLayout = () => {
  const navigate = useNavigate();

  useBackButton(() => {
    navigate(-1);
  });
  return (
    <>
      <SettingsHeader className={`${styles.container} container`}>
        Language
      </SettingsHeader>

      <Outlet />
    </>
  );
};
