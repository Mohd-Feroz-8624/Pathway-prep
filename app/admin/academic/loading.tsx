export default function AcademicLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="animate-pulse">
          {/* Breadcrumb */}
          <div className="h-4 w-64 rounded bg-slate-200" />

          {/* Header */}
          <div className="mt-8">
            <div className="h-4 w-32 rounded bg-slate-200" />

            <div className="mt-3 h-10 w-72 rounded bg-slate-200" />

            <div className="mt-4 h-5 w-96 max-w-full rounded bg-slate-200" />
          </div>

          {/* Cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-2xl bg-slate-200" />

                <div className="mt-6 h-6 w-40 rounded bg-slate-200" />

                <div className="mt-4 h-4 w-24 rounded bg-slate-200" />

                <div className="mt-6 h-11 w-full rounded-xl bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
