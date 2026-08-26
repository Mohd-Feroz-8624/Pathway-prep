import Link from "next/link";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminAcademicPage() {
  await requireAdmin();

  const semesters = await prisma.semester.findMany({
    orderBy: {
      number: "asc",
    },
    include: {
      subjects: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Admin Dashboard
            </Link>

            <p className="mt-6 text-sm font-semibold text-blue-600">
              Academic Management
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              Academic Content
            </h1>

            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              Manage semesters and their subjects for Pathway Prep.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Semester
          </button>
        </div>

        {/* Semesters */}
        {semesters.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              📚
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No semesters available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add your first semester to start building academic content.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {semesters.map((semester) => (
              <article
                key={semester.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
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

                <p className="mt-2 text-sm text-slate-500">
                  {semester.subjects.length}{" "}
                  {semester.subjects.length === 1 ? "subject" : "subjects"}
                </p>

                <Link
                  href={`/admin/academic/${semester.id}`}
                  className="mt-6 block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Manage Semester
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
