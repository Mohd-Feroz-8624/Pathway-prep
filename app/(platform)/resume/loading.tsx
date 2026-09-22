export default function Loading() {
  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
        </div>

        <div className="h-10 w-36 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Resume cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border bg-card"
          >
            <div className="h-48 animate-pulse bg-muted" />

            <div className="space-y-4 p-5">
              <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />

              <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />

              <div className="flex gap-2">
                <div className="h-9 flex-1 animate-pulse rounded-md bg-muted" />
                <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
