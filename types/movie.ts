export type Movie = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string;
  runtime?: number;
};

export type MovieDetails = Movie & {
  overview?: string;
  genres?: { id: number; name: string }[];
};
