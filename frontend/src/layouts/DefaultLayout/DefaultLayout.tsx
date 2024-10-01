
import BottomNavigationComponent from "@/reusable-in-pages/components/BottomNavigation/BottomNavigation";
import { Outlet } from "react-router-dom";

export const DefaultLayout = () => {
  return (
    <>
      <Outlet />
      <BottomNavigationComponent />
    </>
  );
};
