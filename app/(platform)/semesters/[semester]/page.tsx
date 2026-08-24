import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type SemesterPageProps = {
  params: Promise<{
    semester: string;
  }>;
};

function getSubjectSlug(subject: string) {
  return subject.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
}

export default async function SemesterDetailPage({
  params,
}: SemesterPageProps) {
  const { semester } = await params;

  const semesterNumber = Number(semester);

  if (
    !Number.isInteger(semesterNumber) ||
    semesterNumber < 1 ||
    semesterNumber > 8
  ) {
    notFound();
  }

  const semesterData = await prisma.semester.findUnique({
    where: {
      number: semesterNumber,
    },
    include: {
      subjects: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  if (!semesterData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">
            Academic Journey
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            {semesterData.name}
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Explore the subjects and learning resources available for this
            semester.
          </p>
        </div>

        {/* Subjects */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">Subjects</h2>

            <span className="text-sm font-medium text-slate-500">
              {semesterData.subjects.length}{" "}
              {semesterData.subjects.length === 1 ? "subject" : "subjects"}
            </span>
          </div>

          {semesterData.subjects.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <h3 className="text-lg font-bold text-slate-950">
                No subjects available
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Subjects will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {semesterData.subjects.map((subject) => (
                <article
                  key={subject.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                    {subject.name.charAt(0)}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {subject.name}
                  </h3>

                  {subject.code && (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {subject.code}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-slate-500">
                    Explore units, topics, notes, and learning resources.
                  </p>

                  <Link
                    href={`/semesters/${semesterNumber}/${getSubjectSlug(
                      subject.name,
                    )}`}
                    className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View Resources →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
