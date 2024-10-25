import { BASE_URL } from "../constants/constants";

export const transformPathToPhoto = (str: string | null) => {
  if (str === null) return "";

  return `${BASE_URL}${str}`;
};
