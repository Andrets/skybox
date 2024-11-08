export interface ShortsItemModel {
  id: number;
  serail_name: string;
  episode: number;
  name: string;
  likes: number;
  video: string;
  serail_id: number;
  is_liked: boolean;
  favorite_count: number;
  user_has_favorited: boolean;
}

export interface NotFoundShortsDetail {
  details: string;
}

export interface SendLikeQueryParams {
  shorts_id: number;
  serail_id: number;
}
