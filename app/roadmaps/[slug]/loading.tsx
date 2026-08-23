export default function RoadmapDetailLoading() {
  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      {/* Roadmap header skeleton */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl animate-pulse px-6 py-16 lg:px-8">
          <div className="h-7 w-28 rounded-full bg-slate-200" />

          <div className="mt-6 h-12 w-3/4 rounded-lg bg-slate-200" />

          <div className="mt-5 h-6 w-full max-w-3xl rounded-lg bg-slate-200" />
          <div className="mt-2 h-6 w-2/3 max-w-2xl rounded-lg bg-slate-200" />

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="h-16 w-32 rounded-xl bg-slate-200" />
            <div className="h-16 w-24 rounded-xl bg-slate-200" />
            <div className="h-16 w-24 rounded-xl bg-slate-200" />
          </div>
        </div>
      </section>

      {/* Learning path skeleton */}
      <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
        <div className="animate-pulse">
          <div className="h-9 w-64 rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />
        </div>

        <div className="mt-10 space-y-6">
          {[1, 2, 3].map((stage) => (
            <div
              key={stage}
              className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Stage header */}
              <div className="border-b bg-slate-50 px-6 py-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-6 w-48 rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-200" />
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="divide-y">
                {[1, 2, 3, 4].map((task) => (
                  <div key={task} className="flex items-start gap-4 px-6 py-5">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-slate-200" />

                    <div className="flex-1">
                      <div className="h-5 w-3/4 rounded bg-slate-200" />
                      <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
