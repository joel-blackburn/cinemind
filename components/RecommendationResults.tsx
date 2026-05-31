import type { Movie } from "@/types/movie";
import type { Recommendation } from "@/types/recommendation";

type RecommendationResultsProps = {
  recommendations: Recommendation[];
  openMovieDetails: (movieId: number) => void;
  toggleWatchlist: (movie: Movie) => void;
  saveRecommendationToWatchlist: (title: string) => void;
  isInWatchlist: (movieId: number) => boolean;
  formatRuntime: (runtime?: number) => string;
};

export function RecommendationResults({
  recommendations,
  openMovieDetails,
  toggleWatchlist,
  saveRecommendationToWatchlist,
  isInWatchlist,
  formatRuntime,
}: RecommendationResultsProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="mt-16 text-left">
      <h2 className="mb-6 text-2xl font-bold">Recommended for you</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {recommendations.map((rec) => (
          <article
            key={rec.title}
            className="overflow-hidden rounded-2xl border border-purple-300/20 bg-purple-300/10"
          >
            {rec.movie?.poster_path && (
              <button
                onClick={() => openMovieDetails(rec.movie!.id)}
                className="block w-full"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${rec.movie.poster_path}`}
                  alt={rec.title}
                  className="h-80 w-full object-cover transition hover:scale-105"
                />
              </button>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <button
                    onClick={() =>
                      rec.movie ? openMovieDetails(rec.movie.id) : undefined
                    }
                    className="text-left"
                  >
                    <h3 className="text-xl font-bold hover:text-purple-200">
                      {rec.title}
                    </h3>
                  </button>

                  {rec.movie && (
                    <p className="mt-1 text-sm text-gray-400">
                      {rec.movie.release_date?.slice(0, 4) || "Unknown"} ·{" "}
                      {formatRuntime(rec.movie.runtime)} · ⭐{" "}
                      {rec.movie.vote_average?.toFixed(1) || "N/A"}
                    </p>
                  )}
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
                  Cimemind Match {rec.score}/10
                </span>
              </div>

              <p className="mt-4 leading-7 text-gray-300">{rec.reason}</p>

              <button
                onClick={() =>
                  rec.movie
                    ? toggleWatchlist(rec.movie)
                    : saveRecommendationToWatchlist(rec.title)
                }
                className={`mt-6 rounded-full px-5 py-2 text-sm font-semibold transition ${
                  rec.movie && isInWatchlist(rec.movie.id)
                    ? "border border-white/20 text-white hover:bg-white/10"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {rec.movie && isInWatchlist(rec.movie.id)
                  ? "Remove from Watchlist"
                  : "Save to Watchlist"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
