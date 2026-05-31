import type { Movie } from "./movie";

export type Recommendation = {
  title: string;
  reason: string;
  score: number;
  movie?: Movie;
};

export type RecommendationPreferences = {
  mood: string;
  watchingWith: string;
  runtime: string;
  intensity: string;
  twistLevel: string;
  genres: string[];
  avoid: string[];
};
