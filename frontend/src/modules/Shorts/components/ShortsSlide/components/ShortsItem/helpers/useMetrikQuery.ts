import { useMetrikViewMutation } from "@/api/ShortsApi";
import { useEffect, useState } from "react";

export const useMetrikQuery = (isActive: boolean, shorts_id: number) => {
  const [isMetrik, setIsMetrik] = useState(false);
  const [metrikQuery] = useMetrikViewMutation();

  useEffect(() => {
    if (!isMetrik && isActive) {
      metrikQuery(shorts_id);
      setIsMetrik(true);
    }
  }, [isActive]);
};
