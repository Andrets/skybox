export enum ExclusiveOriginalsSearchParams {
  popular = "popular",
  new = "new",
  original = "original",
  male = "male",
  female = "female",
}

export interface TopSerial {
  id: number;
  name: string;
  genre: string;
  vertical_photo: null | string; // Используйте null | string, чтобы указать, что поле может быть null
  rating: number;
  description: string;
}

export interface RecomendationFilmItem {
  id: number;
  name: string;
  genre: string;
  vertical_photo: null | string; // Используйте null | string, чтобы указать, что поле может быть null
  rating: number;
  description: string | null; // Используйте string | null, чтобы указать, что поле может быть null
}

export interface RecomendationFilmList {
  you_might_like: RecomendationFilmItem[];
}

export interface ExclusiveFilmItem {
  id: number;
  name: string;
  genre: string;
  vertical_photo: null | string;
  rating: number;
  description: string;
  views: number;
}

export interface ExclusiveFilmList {
  serials: ExclusiveFilmItem[];
}

export interface TopSerialList {
  top_3: TopSerial[];
}
