export default function TopicLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div>
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-200" />
        </div>

        {/* Topic header skeleton */}
        <div className="mt-6 max-w-3xl">
          <div className="h-10 w-80 animate-pulse rounded bg-slate-200" />

          <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-slate-200" />

          <div className="mt-2 h-5 w-3/4 max-w-xl animate-pulse rounded bg-slate-200" />
        </div>

        {/* Notes section skeleton */}
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

              <div className="mt-2 h-7 w-48 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
          </div>

          {/* Note cards */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <article
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                {/* Icon */}
                <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

                {/* Title */}
                <div className="mt-5 h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                {/* Description */}
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />

                <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-200" />

                {/* Button */}
                <div className="mt-6 h-10 w-36 animate-pulse rounded-xl bg-slate-200" />
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
 