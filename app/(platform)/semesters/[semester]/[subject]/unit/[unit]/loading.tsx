export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-2 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-2 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
        </div>

        
        <div className="mt-8 max-w-3xl">
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-11 w-3/4 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-5 space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-5/6 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <div className="h-9 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-9 w-28 animate-pulse rounded-full bg-slate-200" />
          <div className="h-9 w-32 animate-pulse rounded-full bg-slate-200" />
        </div>

        <section className="mt-12">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />
          
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                  <div className="h-6 w-28 animate-pulse rounded-full bg-slate-200" />
                </div>

                <div className="mt-5 h-6 w-3/4 animate-pulse rounded-lg bg-slate-200" />

                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                </div>

                <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
