export default function Loading() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-muted" />
      </div>

      {/* Progress / stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border bg-card p-5">
            <div className="h-4 w-24 animate-pulse rounded-md bg-muted" />
            <div className="mt-3 h-7 w-20 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />

        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
              </div>

              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
