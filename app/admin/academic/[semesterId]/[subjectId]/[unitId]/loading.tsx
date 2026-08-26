export default function UnitLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="animate-pulse">
          {/* Breadcrumb */}
          <div className="h-4 w-96 max-w-full rounded bg-slate-200" />

          {/* Header */}
          <div className="mt-8">
            <div className="h-4 w-24 rounded bg-slate-200" />

            <div className="mt-3 h-10 w-80 rounded bg-slate-200" />

            <div className="mt-4 h-5 w-lg max-w-full rounded bg-slate-200" />
          </div>

          {/* Add Resource button */}
          <div className="mt-8 h-11 w-36 rounded-xl bg-slate-200" />

          {/* Resource heading */}
          <div className="mt-10">
            <div className="h-7 w-56 rounded bg-slate-200" />

            <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-200" />
          </div>

          {/* Resource cards */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-slate-200" />

                  <div className="h-6 w-28 rounded-full bg-slate-200" />
                </div>

                <div className="mt-5 h-6 w-56 rounded bg-slate-200" />

                <div className="mt-3 h-4 w-full rounded bg-slate-200" />

                <div className="mt-2 h-4 w-3/4 rounded bg-slate-200" />

                <div className="mt-6 flex gap-3">
                  <div className="h-10 w-20 rounded-xl bg-slate-200" />

                  <div className="h-10 w-20 rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
