export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative flex min-h-screen items-center justify-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3b0764_0%,#111827_35%,#000000_75%)] opacity-80" />

        <div className="relative z-10 max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-purple-300">
            CineMind
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Find your next obsession.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            AI-powered movie recommendations based on your mood, taste, watch
            history and the kind of night you&apos;re planning.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-gray-200">
              Get Recommendations
            </button>

            <button className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              View Watchlist
            </button>
          </div>

          <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-purple-200">
                Mood aware
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Pick the vibe and let CineMind narrow the field.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-purple-200">
                Twist tuned
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Choose whether you want easy viewing or a proper mind-bender.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-purple-200">
                Built for taste
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Designed to learn what you love and avoid repeat suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
