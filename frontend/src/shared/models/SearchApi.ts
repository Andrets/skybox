export interface SearchResultItem {
  id: number;
  name: string;
  vertical_photo: null | string; // Photo URL or null
  genre: string;
  rating: number;
  description: string;
}

export interface SearchResultResponse {
  results: SearchResultItem[];
}

export interface SearchHistoryResponse {
  search_history: string[];
}

export interface TransformHistoryResponseItem {
  id: number | string;
  value: string;
}

