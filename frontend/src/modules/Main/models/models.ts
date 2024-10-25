import { ExclusiveFilmItem, ExclusiveOriginalsSearchParams, RecomendationFilmItem, TopSerialList } from "@/shared/models/MainPageApi";


export interface CategoryFilm {
  poster: string;
}

export interface ExclusiveListProps {
  data: ExclusiveFilmItem[];
}

export interface RecomendationListProps {
  data: RecomendationFilmItem[];
}

export interface TopSerialListProps {
  data: TopSerialList["top_3"];
}

export interface MainSliceState {
  activeCategory: ExclusiveOriginalsSearchParams;
}
