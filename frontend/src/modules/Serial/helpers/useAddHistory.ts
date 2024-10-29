import { useAddHistoryMutation } from "@/api/FilmInfoApi";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const useAddHistory = () => {
  const { id } = useParams();
  const [addHistoryQuery] = useAddHistoryMutation();

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      addHistoryQuery(Number(id));
    }
  }, []);
};
