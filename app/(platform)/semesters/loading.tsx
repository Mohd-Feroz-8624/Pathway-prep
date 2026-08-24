export default function SemestersLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header skeleton */}
        <div className="max-w-3xl">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-10 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-5 w-3/4 max-w-xl animate-pulse rounded bg-slate-200" />
        </div>

        {/* Semester cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />

              <div className="mt-6 h-6 w-32 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-4 w-40 animate-pulse rounded bg-slate-200" />

              <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
