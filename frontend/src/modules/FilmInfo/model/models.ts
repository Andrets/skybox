export interface FilmAssetsProps {
  photos: string[];
}

export interface FilmInfoProps {
  description: string;
  genre: string;
  is_new: boolean;
  name: string;
  rating: number;
  user_rating: number | null;
}

