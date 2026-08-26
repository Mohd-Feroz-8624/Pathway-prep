import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type SemesterPageProps = {
  params: Promise<{
    semesterId: string;
  }>;
};

export default async function AdminSemesterPage({ params }: SemesterPageProps) {
  await requireAdmin();

  const { semesterId } = await params;

  const semester = await prisma.semester.findUnique({
    where: {
      id: semesterId,
    },
    include: {
      subjects: {
        orderBy: {
          name: "asc",
        },
        include: {
          units: true,
        },
      },
    },
  });

  if (!semester) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/admin" className="transition hover:text-blue-600">
            Admin
          </Link>

          <span>/</span>

          <Link
            href="/admin/academic"
            className="transition hover:text-blue-600"
          >
            Academic Content
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-700">
            Semester {semester.number}
          </span>
        </div>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Semester {semester.number}
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              {semester.name}
            </h1>

            <p className="mt-3 text-lg text-slate-600">
              Manage subjects and units for this semester.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Subject
          </button>
        </div>

        {/* Subjects */}
        {semester.subjects.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              📚
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No subjects available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add subjects to start building this semester.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {semester.subjects.map((subject) => (
              <article
                key={subject.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                    📘
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Subject
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold text-slate-950">
                  {subject.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {subject.units.length}{" "}
                  {subject.units.length === 1 ? "unit" : "units"}
                </p>

                <Link
                  href={`/admin/academic/${semester.id}/${subject.id}`}
                  className="mt-6 block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Manage Subject
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
