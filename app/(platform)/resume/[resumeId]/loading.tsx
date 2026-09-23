export default function Loading() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-56 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      {/* Editor layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor panel */}
        <div className="space-y-4 rounded-xl border bg-card p-6">
          <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />

          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />

              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            </div>
          ))}
        </div>

        {/* Preview panel */}
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-5 h-6 w-24 animate-pulse rounded-md bg-muted" />

          <div className="min-h-162.5 space-y-6 rounded-md border bg-background p-8">
            <div className="space-y-3">
              <div className="mx-auto h-7 w-48 animate-pulse rounded-md bg-muted" />
              <div className="mx-auto h-4 w-64 animate-pulse rounded-md bg-muted" />
            </div>

            <div className="space-y-3">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-11/12 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded-md bg-muted" />
            </div>

            <div className="space-y-3">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-10/12 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded-md bg-muted" />
            </div>

            <div className="space-y-3">
              <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-11/12 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
