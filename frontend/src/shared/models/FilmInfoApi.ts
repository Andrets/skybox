export interface CommentInfo {
  text: string;
  tg_username: string;
  user_avatar: string;
}

export interface FilmInfoResponse {
  comments: CommentInfo[];
  description: string;
  genre: string;
  horizontal_photos: string[]; // Массив строк для URL-адресов фотографий
  is_new: boolean;
  name: string;
  rating: number;
  vertical_photo: string | null; // Могут быть строки или null
}

export interface CreateCommentQueryParams {
  serial_id: number;
  text: string;
}

export interface UpdateRatingBody {
  rating: number;
  serail_id: number;
}

export interface SeriesItem {
  episode: number;
  id: number;
  likes: number;
  name: string;
  serail_name: string;
  status: boolean;
  video?: string; // Видео может отсутствовать
}
