export default function ProfileLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

          <div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />

          <div className="h-5 w-full max-w-xl animate-pulse rounded bg-slate-200" />
        </div>

        {/* Personal Information */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-3">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>

            {/* Email */}
            <div>
              <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>

            {/* College */}
            <div>
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>

            {/* Branch + Semester */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>

              <div>
                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>

            {/* Career Goal */}
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </section>

        {/* Professional Links */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 space-y-3">
            <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="space-y-6">
            {/* GitHub */}
            <div>
              <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>

            {/* LinkedIn */}
            <div>
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <div className="h-12 w-32 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </section>
    </main>
  );
}
