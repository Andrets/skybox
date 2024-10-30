import { CommentInfo } from "@/shared/models/FilmInfoApi";

export interface FilmAssetsProps {
  photos: string[];
}

export interface FilmMainInfoProps {
  description: string;
  genre: string;
  is_new: boolean;
  name: string;
  rating: number;
  user_rating: number | null
}

export interface FilmInfoProps extends FilmMainInfoProps {
  comments: CommentInfo[];
}
