import { BaseComponentInterface } from "@/shared/models/BaseComponentInterfaces";

export interface IPeopleSearchingItem {
  poster: string;
  category?: string;
  status?: string;
  header: string;
  description: string;
}

export interface PeopleSearchingItemProps
  extends IPeopleSearchingItem,
    BaseComponentInterface {}
