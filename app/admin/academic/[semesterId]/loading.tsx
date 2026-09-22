export default function SemesterLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="animate-pulse">
          {/* Breadcrumb */}
          <div className="h-4 w-72 rounded bg-slate-200" />

          {/* Header */}
          <div className="mt-8">
            <div className="h-4 w-32 rounded bg-slate-200" />

            <div className="mt-3 h-10 w-80 rounded bg-slate-200" />

            <div className="mt-4 h-5 w-[28rem] max-w-full rounded bg-slate-200" />
          </div>

          {/* Subject list */}
          <div className="mt-10 grid gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="h-5 w-12 rounded bg-slate-200" />

                    <div className="mt-3 h-6 w-56 rounded bg-slate-200" />
                  </div>

                  <div className="h-10 w-32 rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
