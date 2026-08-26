import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function SemestersPage() {
  const semesters = await prisma.semester.findMany({
    orderBy: {
      number: "asc",
    },
    include: {
      subjects: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 ">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            {/* Heading */}
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-blue-600">
                Academic Journey
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                Your Semesters
              </h1>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                Access subjects, notes, resources, and preparation material for
                every semester of your degree.
              </p>
            </div>
          </div>
        </div>

        {semesters.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              No semesters available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Academic content will appear here once it is added.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {semesters.map((semester) => (
              <article
                key={semester.id}
                className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
                    {semester.number}
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Semester
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold text-slate-950">
                  {semester.name}
                </h2>

                {/* Subjects */}
                <div className="mt-5 space-y-2">
                  {semester.subjects.length > 0 ? (
                    semester.subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 mb-2"
                      >
                        {subject.name}
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                      Subjects coming soon
                    </p>
                  )}
                </div>

                {/* Always at bottom */}
                <Link
                  href={`/semesters/${semester.number}`}
                  className="mt-auto block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Explore Semester
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
