import { TransformHistoryResponseItem } from "@/shared/models/SearchApi";

export const isIncludeValue = (
  arr: TransformHistoryResponseItem[],
  searchValue: string
) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value === searchValue) return true;
  }

  return false;
};
