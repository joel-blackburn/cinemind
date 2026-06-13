import type { RecommendationPreferences } from "@/types/recommendation";

type RecommendationFormProps = {
  preferences: RecommendationPreferences;
  submittedPreferences: RecommendationPreferences | null;
  recommendationLoading: boolean;
  recommendationLoadingMessage: string;
  recommendationProgress: number;
  recommendationError: string;
  genreOptions: string[];
  avoidOptions: string[];
  setPreferences: (preferences: RecommendationPreferences) => void;
  toggleGenre: (genre: string) => void;
  toggleAvoid: (option: string) => void;
  submitPreferences: () => void;
  getRecommendations: () => void;
};

export function RecommendationForm({
  preferences,
  submittedPreferences,
  recommendationLoading,
  recommendationLoadingMessage,
  recommendationProgress,
  recommendationError,
  genreOptions,
  avoidOptions,
  setPreferences,
  toggleGenre,
  toggleAvoid,
  submitPreferences,
  getRecommendations,
}: RecommendationFormProps) {
  return (
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
            ["Under 90 mins", "Under 2 hours", "Any length", "Epic is fine"],
          ],
          ["intensity", "Intensity", ["Low", "Medium", "High", "Unhinged"]],
          [
            "twistLevel",
            "Twist level",
            [
              "Straightforward",
              "A Few Surprises",
              "Keeps You Guessing",
              "Twisty",
              "Break my brain",
            ],
          ],
        ].map(([key, label, options]) => (
          <label key={key as string} className="block">
            <span className="text-sm font-semibold text-purple-200">
              {label as string}
            </span>
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              value={
                preferences[key as keyof RecommendationPreferences] as string
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
            Avoid: {submittedPreferences.avoid.join(", ") || "Nothing specific"}
          </p>

          <button
            onClick={getRecommendations}
            disabled={recommendationLoading}
            className="mt-6 rounded-full bg-white px-7 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            {recommendationLoading
              ? recommendationLoadingMessage
              : "Recommend For Me"}
          </button>

          {recommendationLoading && (
            <div className="mt-5 rounded-2xl border border-purple-300/20 bg-black/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-purple-200">
                  {recommendationLoadingMessage}
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-purple-300 transition-all duration-700"
                  style={{ width: `${recommendationProgress}%` }}
                />
              </div>

              <div className="mt-4 grid gap-2 text-xs text-gray-400 sm:grid-cols-3">
                <span>✓ Reading your taste</span>
                <span>✓ Finding patterns</span>
                <span>✓ Matching films</span>
              </div>
            </div>
          )}

          {recommendationError && (
            <p className="mt-4 text-sm text-red-300">{recommendationError}</p>
          )}
        </div>
      )}
    </div>
  );
}
