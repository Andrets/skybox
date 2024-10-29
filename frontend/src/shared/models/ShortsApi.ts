export interface ShortsItemModel {
  episode: number;
  id: number;
  likes: number;
  name: string;
  serail_name: string;
  video: string;
  serail_id: number;
  is_liked: boolean;
}

export interface NotFoundShortsDetail {
  details: string;
}

export interface SendLikeQueryParams{
  shorts_id: number;
  serail_id: number
}