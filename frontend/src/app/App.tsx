import { useCurrentPath } from "@/shared/hooks/useCurrentPath";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const App = () => {
  const pathname = useCurrentPath();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Outlet />
    </>
  );
};
