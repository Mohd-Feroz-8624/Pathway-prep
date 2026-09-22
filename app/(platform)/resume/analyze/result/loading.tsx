export default function Loading() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded-md bg-muted" />
      </div>

      {/* Overall score */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="h-32 w-32 shrink-0 animate-pulse rounded-full bg-muted" />

          <div className="flex-1 space-y-3">
            <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-xl border bg-card p-5">
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
            <div className="mt-3 h-7 w-16 animate-pulse rounded-md bg-muted" />
            <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>

      {/* Strengths / weaknesses */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="h-6 w-28 animate-pulse rounded-md bg-muted" />

          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-full animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />

          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-full animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border bg-card p-6">
        <div className="h-6 w-36 animate-pulse rounded-md bg-muted" />

        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-4 w-full animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
