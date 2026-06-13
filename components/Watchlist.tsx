import type { Movie } from "@/types/movie";

type WatchlistProps = {
  watchlist: Movie[];
  openMovieDetails: (movieId: number) => void;
  toggleWatchlist: (movie: Movie) => void;
};

export function Watchlist({
  watchlist,
  openMovieDetails,
  toggleWatchlist,
}: WatchlistProps) {
  if (watchlist.length === 0) return null;

  return (
    <div className="mt-16 text-left">
      <h2 className="mb-6 text-2xl font-bold">Your watchlist</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {watchlist.map((movie) => (
          <article
            key={movie.id}
            className="overflow-hidden rounded-2xl border border-purple-300/20 bg-purple-300/10"
          >
            {movie.poster_path && (
              <button
                onClick={() => openMovieDetails(movie.id)}
                className="block w-full"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="h-80 w-full object-cover transition hover:scale-105"
                />
              </button>
            )}

            <div className="p-4">
              <button
                onClick={() => openMovieDetails(movie.id)}
                className="text-left"
              >
                <h3 className="font-semibold hover:text-purple-200">
                  {movie.title}
                </h3>
              </button>

              <p className="mt-1 text-sm text-gray-400">
                {movie.release_date?.slice(0, 4) || "Unknown"} · ⭐{" "}
                {movie.vote_average?.toFixed(1) || "N/A"}
              </p>

              <button
                onClick={() => toggleWatchlist(movie)}
                className="mt-4 w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Remove from Watchlist
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
