import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import PageBreadcrumb from "@/components/dashboard/PageBreadCrump";

type SubjectPageProps = {
  params: Promise<{
    semester: string;
    subject: string;
  }>;
};

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { semester, subject } = await params;

  const semesterNumber = Number(semester);

  if (
    !Number.isInteger(semesterNumber) ||
    semesterNumber < 1 ||
    semesterNumber > 8
  ) {
    notFound();
  }

  const subjectData = await prisma.subject.findFirst({
    where: {
      slug: subject,
      semester: {
        number: semesterNumber,
      },
    },

    include: {
      units: {
        orderBy: {
          number: "asc",
        },

        include: {
          resources: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!subjectData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Semesters", href: "/semesters" },
            {
              label: `Semester ${semesterNumber}`,
              href: `/semesters/${semesterNumber}`,
            },
            {
              label: subjectData.name
            },
          ]}
        />
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">
            Semester {semesterNumber}
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            {subjectData.name}
          </h1>

          {subjectData.code && (
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {subjectData.code}
            </p>
          )}

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Learn this subject through structured units, curated resources, and
            guided learning.
          </p>
        </div>

        {/* Units */}
        <div className="mt-12 space-y-6">
          {subjectData.units.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <h2 className="text-lg font-bold text-slate-950">
                No units available
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Learning units will appear here once they are added.
              </p>
            </div>
          ) : (
            subjectData.units.map((unit) => (
              <article
                key={unit.id}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Unit heading */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                    {unit.number}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      Unit {unit.number}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-950">
                      {unit.title}
                    </h2>
                  </div>
                </div>

                {/* Description */}
                {unit.description ? (
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
                    {unit.description}
                  </p>
                ) : (
                  <p className="mt-5 text-sm leading-7 text-slate-500">
                    Learn the concepts and resources covered in this unit.
                  </p>
                )}

                {/* Metadata */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {unit.difficulty && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                        unit.difficulty === "Beginner"
                          ? "bg-emerald-50 text-emerald-700"
                          : unit.difficulty === "Intermediate"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {unit.difficulty}
                    </span>
                  )}

                  {unit.duration && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      ⏱ {unit.duration}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    📚 {unit.resources.length}{" "}
                    {unit.resources.length === 1 ? "resource" : "resources"}
                  </span>
                </div>

                {/* Bottom action */}
                <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <p className="text-sm text-slate-500">
                    Start this unit when you&apos;re ready to learn.
                  </p>

                  <Link
                    href={`/semesters/${semesterNumber}/${subject}/unit/${unit.number}`}
                    className="shrink-0 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Start Unit →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
