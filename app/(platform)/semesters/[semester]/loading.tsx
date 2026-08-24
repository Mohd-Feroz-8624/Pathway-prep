export default function SemesterLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header skeleton */}
        <div className="max-w-3xl">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-10 w-56 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-5 w-3/4 max-w-xl animate-pulse rounded bg-slate-200" />
        </div>

        {/* Section heading */}
        <div className="mt-12 flex items-center justify-between">
          <div className="h-7 w-32 animate-pulse rounded bg-slate-200" />

          <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Subject cards */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />

              <div className="mt-5 h-6 w-40 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-200" />

              <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-200" />

              <div className="mt-5 h-4 w-28 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
