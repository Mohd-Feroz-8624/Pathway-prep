export default function InterviewLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

          <div className="h-10 w-72 animate-pulse rounded-lg bg-slate-200" />

          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-3/4 max-w-xl animate-pulse rounded bg-slate-200" />
        </div>

        {/* AI Mock Interview */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Card Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-slate-100" />

                <div className="space-y-3">
                  <div className="h-7 w-52 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-3/4 max-w-lg animate-pulse rounded bg-slate-100" />
                </div>
              </div>

              <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
            </div>

            {/* Select Fields */}
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                  <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
                </div>
              ))}
            </div>

            {/* Start Button */}
            <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />

              <div className="h-12 w-40 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        </section>

        {/* Interview Activity */}
        <section>
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

            <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />

            <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-100" />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />

                <div className="mt-5 h-4 w-36 animate-pulse rounded bg-slate-100" />

                <div className="mt-2 h-9 w-20 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </section>

        {/* Career Preparation CTAs */}
        <section className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-100" />

              <div className="mt-5 h-4 w-32 animate-pulse rounded bg-slate-100" />

              <div className="mt-2 h-6 w-48 animate-pulse rounded bg-slate-200" />

              <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />

              <div className="mt-6 h-11 w-36 animate-pulse rounded-xl bg-slate-200" />
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
