import styles from "./styles.module.scss";
import { SubsDrawer, UnlockNowButton } from "./ui";
import { useTranslation } from "react-i18next";
import SideButtons from "../Control/components/SideButtons/SideButtons";
import { useAppDispatch } from "@/shared/hooks/reduxTypes";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { setIsBlockedSlide } from "@/modules/Serial/slices/FilmVideoSlice";
import {
  useGetSubPricesForSerialQuery,
  useGetSubPricesQuery,
} from "@/api/userApi";
import { useParams } from "react-router-dom";

export const BlockSlide = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [modal, setModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { id } = useParams();

  const { data } = useGetSubPricesQuery();
  const { data: serialData } = useGetSubPricesForSerialQuery(String(id));

  useEffect(() => {
    dispatch(setIsBlockedSlide(true));

    return () => {
      dispatch(setIsBlockedSlide(false));
    };
  }, []);

  useEffect(() => {
    const func = () => {
      setModal(false);
    };

    window.addEventListener("click", func);

    return () => {
      window.removeEventListener("click", func);
    };
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setModal(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleUnlockButton: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setModal(true);
  };

  const handleCloseClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setModal(false);
  };
  return (
    <>
      <UnlockNowButton
        onClick={handleUnlockButton}
        className={styles.unlockNowBtn}
      >
        {t("unlockNow")}
      </UnlockNowButton>

      <div className={styles.cont}>
        <SideButtons />
      </div>

      {data && (
        <SubsDrawer
          serial_data={serialData}
          closeClick={handleCloseClick}
          open={modal}
          data={data}
        />
      )}
    </>
  );
};
