import { LinkProps } from "react-router-dom";

export interface IPeopleSearchingItem {
  poster: string;
  category?: string;
  status?: string;
  header: string;
}

export interface PeopleSearchingItemProps
  extends IPeopleSearchingItem,
    LinkProps {}
