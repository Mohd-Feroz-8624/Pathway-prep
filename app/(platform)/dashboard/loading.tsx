export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-8">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

          <div className="h-10 w-72 animate-pulse rounded bg-slate-200" />

          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        </div>

        {/* Profile completeness skeleton */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-200" />

          <div className="mt-5 h-2 w-full animate-pulse rounded bg-slate-200" />
        </div>

        {/* Progress skeleton */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

              <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="h-10 w-16 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-5 h-3 w-full animate-pulse rounded-full bg-slate-200" />
        </div>

        {/* Roadmaps */}
        <div className="space-y-4">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />

          <div className="grid gap-4">
            <div className="h-40 animate-pulse rounded-3xl bg-white" />
            <div className="h-40 animate-pulse rounded-3xl bg-white" />
          </div>
        </div>

        <p className="text-center text-sm text-slate-500">
          Loading your learning progress...
        </p>
      </section>
    </main>
  );
}
