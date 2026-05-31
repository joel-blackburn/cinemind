import type { MovieDetails } from "@/types/movie";

type MovieModalProps = {
  selectedMovie: MovieDetails | null;
  toggleWatchlist: (movie: MovieDetails) => void;
  isInWatchlist: (movieId: number) => boolean;
  onClose: () => void;
};

export function MovieModal({
  selectedMovie,
  toggleWatchlist,
  isInWatchlist,
  onClose,
}: MovieModalProps) {
  if (!selectedMovie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 text-left shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-white/20 px-3 py-1 text-sm text-white hover:bg-white/10"
        >
          Close
        </button>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {selectedMovie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
              className="w-full rounded-2xl object-cover"
            />
          )}

          <div>
            <h2 className="pr-16 text-3xl font-bold">{selectedMovie.title}</h2>

            <p className="mt-2 text-sm text-gray-400">
              {selectedMovie.release_date?.slice(0, 4) || "Unknown"} ·{" "}
              {selectedMovie.runtime || "Unknown"} mins · ⭐{" "}
              {selectedMovie.vote_average?.toFixed(1) || "N/A"}
            </p>

            {selectedMovie.genres && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedMovie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-purple-300/10 px-3 py-1 text-sm text-purple-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 leading-7 text-gray-300">
              {selectedMovie.overview || "No overview available."}
            </p>

            <button
              onClick={() => toggleWatchlist(selectedMovie)}
              className={`mt-8 rounded-full px-6 py-3 font-semibold transition ${
                isInWatchlist(selectedMovie.id)
                  ? "border border-white/20 text-white hover:bg-white/10"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {isInWatchlist(selectedMovie.id)
                ? "Remove from Watchlist"
                : "Save to Watchlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
