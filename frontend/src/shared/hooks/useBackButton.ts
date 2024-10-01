import { useEffect } from "react";
import { useTelegram } from "./useTelegram";
import { useNavigate } from "react-router-dom";

const useBackButton = (onClick?: () => void, active = true) => {
  const { webApp } = useTelegram();
  const navigate = useNavigate();

  const defaultFunc = () => {
    navigate(-1);
  };
  useEffect(() => {
    if (active) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onClick ? onClick : defaultFunc);
    } else {
      webApp.BackButton.offClick(onClick ? onClick : defaultFunc);
      webApp.BackButton.hide();
    }

    return () => {
      webApp.BackButton.offClick(onClick ? onClick : defaultFunc);
      webApp.BackButton.hide();
    };
  }, [onClick, active]);
};

export default useBackButton;
