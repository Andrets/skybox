import { routes } from "@/app/router";
import { matchRoutes, useLocation } from "react-router-dom";

export const useCurrentPath = () => {
  const location = useLocation();
  const elem = matchRoutes(routes, location.pathname);
  if (elem) {
    return elem[1]?.route?.path;
  }
  return elem;
};
