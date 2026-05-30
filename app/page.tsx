"use client";

import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string;
};

type MovieDetails = Movie & {
  overview?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
};

type RecommendationPreferences = {
  mood: string;
  watchingWith: string;
  runtime: string;
  intensity: string;
  twistLevel: string;
  genres: string[];
  avoid: string[];
};

const genreOptions = [
  "Thriller",
  "Mystery",
  "Sci-Fi",
  "Drama",
  "Comedy",
  "Action",
  "Horror",
  "Crime",
];

const avoidOptions = [
  "Too scary",
  "Too slow",
  "Subtitles",
  "Kids-unfriendly",
  "Over 2.5 hours",
  "Romance-heavy",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedPreferences, setSubmittedPreferences] =
    useState<RecommendationPreferences | null>(null);

  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    mood: "Mind-bending",
    watchingWith: "Solo",
    runtime: "Under 2 hours",
    intensity: "Medium",
    twistLevel: "High",
    genres: ["Thriller", "Mystery"],
    avoid: [],
  });

  useEffect(() => {
    const savedWatchlist = localStorage.getItem("cinemind-watchlist");

    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }

    const savedPreferences = localStorage.getItem("cinemind-preferences");

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
      setSubmittedPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cinemind-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("cinemind-preferences", JSON.stringify(preferences));
  }, [preferences]);

  async function searchMovies() {
    if (!query.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setMovies(data.results || []);
    setLoading(false);
  }

  async function openMovieDetails(movieId: number) {
    const res = await fetch(`/api/movie/${movieId}`);
    const data = await res.json();
    setSelectedMovie(data);
  }

  function addToWatchlist(movie: Movie) {
    if (watchlist.some((item) => item.id === movie.id)) return;
    setWatchlist([...watchlist, movie]);
  }

  function removeFromWatchlist(movieId: number) {
    setWatchlist(watchlist.filter((movie) => movie.id !== movieId));
  }

  function isInWatchlist(movieId: number) {
    return watchlist.some((movie) => movie.id === movieId);
  }

  function toggleGenre(genre: string) {
    setPreferences((current) => ({
      ...current,
      genres: current.genres.includes(genre)
        ? current.genres.filter((item) => item !== genre)
        : [...current.genres, genre],
    }));
  }

  function toggleAvoid(option: string) {
    setPreferences((current) => ({
      ...current,
      avoid: current.avoid.includes(option)
        ? current.avoid.filter((item) => item !== option)
        : [...current.avoid, option],
    }));
  }

  function submitPreferences() {
    setSubmittedPreferences(preferences);

    localStorage.setItem("cinemind-preferences", JSON.stringify(preferences));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative flex min-h-screen items-center justify-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b0764_0%,#111827_35%,#000000_75%)] opacity-80" />

        <div className="relative z-10 w-full max-w-6xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-purple-300">
            CineMind
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Find your next obsession.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Start with a film you already love and CineMind will learn your
            taste.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              className="w-full rounded-full border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-gray-500"
              placeholder="Try The Prestige, Oldboy, Se7en..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchMovies();
              }}
            />

            <button
              onClick={searchMovies}
              className="rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:bg-gray-200"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
            {["Mood aware", "Twist tuned", "Built for taste"].map((title) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm font-semibold text-purple-200">{title}</p>
                <p className="mt-2 text-sm text-gray-400">
                  {title === "Mood aware" &&
                    "Pick the vibe and let CineMind narrow the field."}
                  {title === "Twist tuned" &&
                    "Choose whether you want easy viewing or a proper mind-bender."}
                  {title === "Built for taste" &&
                    "Designed to learn what you love and avoid repeat suggestions."}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-2xl font-bold">Recommendation preferences</h2>
            <p className="mt-2 text-sm text-gray-400">
              Tell CineMind what kind of movie night you&apos;re planning.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                [
                  "mood",
                  "Mood",
                  [
                    "Mind-bending",
                    "Easy watch",
                    "Dark",
                    "Funny",
                    "Emotional",
                    "Tense",
                  ],
                ],
                [
                  "watchingWith",
                  "Watching with",
                  ["Solo", "Koby", "Kids", "Friends", "Family"],
                ],
                [
                  "runtime",
                  "Runtime",
                  [
                    "Under 90 mins",
                    "Under 2 hours",
                    "Any length",
                    "Epic is fine",
                  ],
                ],
                [
                  "intensity",
                  "Intensity",
                  ["Low", "Medium", "High", "Unhinged"],
                ],
                [
                  "twistLevel",
                  "Twist level",
                  ["Low", "Medium", "High", "Break my brain"],
                ],
              ].map(([key, label, options]) => (
                <label key={key as string} className="block">
                  <span className="text-sm font-semibold text-purple-200">
                    {label as string}
                  </span>
                  <select
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                    value={
                      preferences[
                        key as keyof RecommendationPreferences
                      ] as string
                    }
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        [key as string]: e.target.value,
                      })
                    }
                  >
                    {(options as string[]).map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-purple-200">Genres</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {genreOptions.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      preferences.genres.includes(genre)
                        ? "bg-purple-300 text-black"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-purple-200">Avoid</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {avoidOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleAvoid(option)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      preferences.avoid.includes(option)
                        ? "bg-white text-black"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={submitPreferences}
              className="mt-8 rounded-full bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Save preferences
            </button>

            {submittedPreferences && (
              <div className="mt-8 rounded-2xl border border-purple-300/20 bg-purple-300/10 p-5">
                <h3 className="font-semibold text-purple-200">
                  Saved recommendation brief
                </h3>
                <p className="mt-3 text-sm text-gray-300">
                  {submittedPreferences.mood} movie, watching with{" "}
                  {submittedPreferences.watchingWith}, runtime{" "}
                  {submittedPreferences.runtime}, intensity{" "}
                  {submittedPreferences.intensity}, twist level{" "}
                  {submittedPreferences.twistLevel}.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Genres: {submittedPreferences.genres.join(", ") || "Any"}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Avoid:{" "}
                  {submittedPreferences.avoid.join(", ") || "Nothing specific"}
                </p>
              </div>
            )}
          </div>

          {movies.length > 0 && (
            <div className="mt-16 text-left">
              <h2 className="mb-6 text-2xl font-bold">Search results</h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {movies.map((movie) => (
                  <article
                    key={movie.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
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
                        onClick={() => addToWatchlist(movie)}
                        disabled={isInWatchlist(movie.id)}
                        className="mt-4 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-purple-300"
                      >
                        {isInWatchlist(movie.id)
                          ? "Saved to Watchlist"
                          : "Save to Watchlist"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {watchlist.length > 0 && (
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
                        onClick={() => removeFromWatchlist(movie.id)}
                        className="mt-4 w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-6 text-left shadow-2xl">
            <button
              onClick={() => setSelectedMovie(null)}
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
                <h2 className="pr-16 text-3xl font-bold">
                  {selectedMovie.title}
                </h2>

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
                  onClick={() => addToWatchlist(selectedMovie)}
                  disabled={isInWatchlist(selectedMovie.id)}
                  className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-purple-300"
                >
                  {isInWatchlist(selectedMovie.id)
                    ? "Saved to Watchlist"
                    : "Save to Watchlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
