import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type SubjectPageProps = {
  params: Promise<{
    semesterId: string;
    subjectId: string;
  }>;
};

export default async function AdminSubjectPage({ params }: SubjectPageProps) {
  await requireAdmin();

  const { semesterId, subjectId } = await params;

  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      semesterId,
    },
    include: {
      semester: true,
      units: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  if (!subject) {
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

          <Link
            href={`/admin/academic/${semesterId}`}
            className="transition hover:text-blue-600"
          >
            Semester {subject.semester.number}
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-700">{subject.name}</span>
        </div>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              {subject.semester.name}
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              {subject.name}
            </h1>

            <p className="mt-3 text-lg text-slate-600">
              Manage units and learning content for this subject.
            </p>
          </div>

          <button
            type="button"
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Unit
          </button>
        </div>

        {/* Units */}
        {subject.units.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              📖
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              No units available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add units to start building this subject.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {subject.units.map((unit) => (
              <article
                key={unit.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
                      {unit.number}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Unit {unit.number}
                      </p>

                      <h2 className="mt-1 text-xl font-bold text-slate-950">
                        {unit.title}
                      </h2>

                      {unit.description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                          {unit.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/admin/academic/${semesterId}/${subjectId}/${unit.id}`}
                    className="shrink-0 rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Manage Unit
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
