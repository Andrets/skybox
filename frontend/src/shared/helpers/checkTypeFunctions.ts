import { NotFoundShortsDetail } from "@/shared/models/ShortsApi";

export const isNotFoundShortsDetail = (
  variable: unknown
): variable is NotFoundShortsDetail => {
  return (
    typeof variable === "object" &&
    variable !== null &&
    "details" in variable &&
    typeof variable.details === "string"
  );
};
