import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Outlet />
    </>
  );
};
