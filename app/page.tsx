"use client";

import { useEffect, useState } from "react";

import type { Movie, MovieDetails } from "@/types/movie";
import type {
  Recommendation,
  RecommendationPreferences,
} from "@/types/recommendation";

import { MovieModal } from "@/components/Movie Modal";
import { RecommendationForm } from "@/components/RecommendationForm";
import { RecommendationResults } from "@/components/RecommendationResults";

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
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [recommendationError, setRecommendationError] = useState("");
  const [recommendationProgress, setRecommendationProgress] = useState(0);

  const recommendationLoadingMessages = ["Finding your next obsession..."];

  const [recommendationLoadingMessage, setRecommendationLoadingMessage] =
    useState(recommendationLoadingMessages[0]);

  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    mood: "Mind-bending",
    watchingWith: "Solo",
    runtime: "Under 2 hours",
    intensity: "Medium",
    twistLevel: "Keeps You Guessing",
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

  useEffect(() => {
    if (!recommendationLoading) {
      setRecommendationProgress(0);
      return;
    }

    let index = 0;
    let progress = 12;

    setRecommendationLoadingMessage(recommendationLoadingMessages[0]);
    setRecommendationProgress(progress);

    const interval = setInterval(() => {
      index = Math.min(index + 1, recommendationLoadingMessages.length - 1);
      progress = Math.min(progress + 18, 88);

      setRecommendationLoadingMessage(recommendationLoadingMessages[index]);
      setRecommendationProgress(progress);

      if (progress >= 88) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [recommendationLoading]);

  async function searchMovies() {
    if (!query.trim()) return;

    setLoading(true);
    setSearchError("");

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);

      if (!res.ok) {
        throw new Error("Movie search failed");
      }

      const data = await res.json();
      setMovies(data.results || []);

      if (!data.results?.length) {
        setSearchError("No movies found. Try another title.");
      }
    } catch {
      setSearchError("Something went wrong while searching. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function openMovieDetails(movieId: number) {
    const res = await fetch(`/api/movie/${movieId}`);
    const data = await res.json();
    setSelectedMovie(data);
  }

  async function getRecommendations() {
    setRecommendationLoading(true);
    setRecommendationError("");
    setRecommendationLoadingMessage(recommendationLoadingMessages[0]);
    setRecommendationProgress(12);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          watchlist,
          preferences,
        }),
      });

      if (!res.ok) {
        throw new Error("Recommendation request failed");
      }

      const data = await res.json();

      const enrichedRecommendations = await Promise.all(
        (data.recommendations || []).map(async (rec: Recommendation) => {
          try {
            const searchRes = await fetch(
              `/api/search?query=${encodeURIComponent(rec.title)}`,
            );

            if (!searchRes.ok) {
              return {
                ...rec,
                movie: undefined,
              };
            }

            const searchData = await searchRes.json();
            const movie = searchData.results?.[0];

            if (!movie) {
              return {
                ...rec,
                movie: undefined,
              };
            }

            try {
              const detailsRes = await fetch(`/api/movie/${movie.id}`);

              if (!detailsRes.ok) {
                return {
                  ...rec,
                  movie,
                };
              }

              const movieDetails = await detailsRes.json();

              return {
                ...rec,
                movie: {
                  ...movie,
                  runtime: movieDetails.runtime,
                },
              };
            } catch {
              return {
                ...rec,
                movie,
              };
            }
          } catch {
            return {
              ...rec,
              movie: undefined,
            };
          }
        }),
      );

      setRecommendationProgress(100);
      setRecommendations(enrichedRecommendations);
    } catch (error) {
      console.error("Recommendation error:", error);

      setRecommendationError(
        "CineMind could not generate recommendations. Try again.",
      );
    } finally {
      setRecommendationLoading(false);
    }
  }

  async function saveRecommendationToWatchlist(title: string) {
    const res = await fetch(`/api/search?query=${encodeURIComponent(title)}`);
    const data = await res.json();

    const firstMatch = data.results?.[0];

    if (!firstMatch) return;

    addToWatchlist(firstMatch);
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

  function toggleWatchlist(movie: Movie) {
    const alreadySaved = watchlist.some((item) => item.id === movie.id);

    if (alreadySaved) {
      removeFromWatchlist(movie.id);
      return;
    }

    addToWatchlist(movie);
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

  function formatRuntime(runtime?: number) {
    if (!runtime) return "Runtime unknown";

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    if (hours === 0) return `${minutes}m`;

    return `${hours}h ${minutes}m`;
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
          {searchError && (
            <p className="mt-4 text-sm text-red-300">{searchError}</p>
          )}
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
          <RecommendationForm
            preferences={preferences}
            submittedPreferences={submittedPreferences}
            recommendationLoading={recommendationLoading}
            recommendationLoadingMessage={recommendationLoadingMessage}
            recommendationProgress={recommendationProgress}
            recommendationError={recommendationError}
            genreOptions={genreOptions}
            avoidOptions={avoidOptions}
            setPreferences={setPreferences}
            toggleGenre={toggleGenre}
            toggleAvoid={toggleAvoid}
            submitPreferences={submitPreferences}
            getRecommendations={getRecommendations}
          />
          <RecommendationResults
            recommendations={recommendations}
            openMovieDetails={openMovieDetails}
            toggleWatchlist={toggleWatchlist}
            saveRecommendationToWatchlist={saveRecommendationToWatchlist}
            isInWatchlist={isInWatchlist}
            formatRuntime={formatRuntime}
          />
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
                        onClick={() => toggleWatchlist(movie)}
                        className={`mt-4 w-full rounded-full px-4 py-2 text-sm font-semibold transition ${
                          isInWatchlist(movie.id)
                            ? "border border-white/20 text-white hover:bg-white/10"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                      >
                        {isInWatchlist(movie.id)
                          ? "Remove from Watchlist"
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

      <MovieModal
        selectedMovie={selectedMovie}
        isInWatchlist={isInWatchlist}
        toggleWatchlist={toggleWatchlist}
        onClose={() => setSelectedMovie(null)}
      />
    </main>
  );
}
