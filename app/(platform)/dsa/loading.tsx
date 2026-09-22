export default function DsaLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

          <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />

          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
        </div>

        {/* Progress Card Skeleton */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="space-y-2 text-right">
              <div className="ml-auto h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="ml-auto h-5 w-16 animate-pulse rounded bg-slate-200" />
            </div>
          </div>

          <div className="mt-6 h-3 animate-pulse rounded-full bg-slate-100" />
        </div>

        {/* Topics Heading */}
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-7 w-40 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Topic Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />

                <div className="h-4 w-16 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="mt-5 h-6 w-28 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />

              <div className="mt-6 h-2 animate-pulse rounded-full bg-slate-100" />

              <div className="mt-4 h-4 w-20 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
