export default function SubjectLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Subject header */}
        <div className="max-w-3xl">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-10 w-72 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-3 w-12 animate-pulse rounded bg-slate-200" />

          <div className="mt-5 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-5 w-3/4 max-w-xl animate-pulse rounded bg-slate-200" />
        </div>

        {/* Unit skeletons */}
        <div className="mt-12 space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <section
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />

                <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, topicIndex) => (
                  <div
                    key={topicIndex}
                    className="h-11 animate-pulse rounded-xl bg-slate-100"
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
