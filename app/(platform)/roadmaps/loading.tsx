export default function RoadmapsLoading() {
  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      {/* Hero skeleton */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl animate-pulse text-center">
            <div className="mx-auto h-8 w-36 rounded-full bg-slate-200" />

            <div className="mx-auto mt-6 h-12 max-w-xl rounded-lg bg-slate-200" />

            <div className="mx-auto mt-4 h-6 max-w-2xl rounded-lg bg-slate-200" />
          </div>
        </div>
      </section>

      {/* Roadmap cards skeleton */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-20 rounded bg-slate-200" />

          <div className="mt-3 h-9 w-80 rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[1, 2].map((card) => (
            <div
              key={card}
              className="animate-pulse rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <div className="h-6 w-24 rounded-full bg-slate-200" />

              <div className="mt-5 h-8 w-3/4 rounded-lg bg-slate-200" />

              <div className="mt-4 h-5 w-full rounded bg-slate-200" />
              <div className="mt-2 h-5 w-5/6 rounded bg-slate-200" />

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="h-20 rounded-2xl bg-slate-100" />
                <div className="h-20 rounded-2xl bg-slate-100" />
                <div className="h-20 rounded-2xl bg-slate-100" />
              </div>

              <div className="mt-7 h-14 rounded-2xl bg-slate-200" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
