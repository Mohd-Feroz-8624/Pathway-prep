import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import PageBreadcrumb from "@/components/dashboard/PageBreadCrump";

type UnitPageProps = {
  params: Promise<{
    semester: string;
    subject: string;
    unit: string;
  }>;
};

function getResourceIcon(type: string) {
  switch (type) {
    case "HANDWRITTEN":
      return "✍️";

    case "PDF":
      return "📄";

    case "EXTERNAL":
      return "🌐";

    case "YOUTUBE":
      return "▶️";

    default:
      return "📚";
  }
}

function getResourceLabel(type: string) {
  switch (type) {
    case "HANDWRITTEN":
      return "Handwritten Notes";

    case "PDF":
      return "PDF Notes";

    case "EXTERNAL":
      return "External Resource";

    case "YOUTUBE":
      return "YouTube Video";

    default:
      return "Learning Resource";
  }
}

function getResourceAction(type: string) {
  switch (type) {
    case "HANDWRITTEN":
      return "View Notes";

    case "PDF":
      return "Open PDF";

    case "EXTERNAL":
      return "Open Guide";

    case "YOUTUBE":
      return "Watch Video";

    default:
      return "Open Resource";
  }
}

export default async function UnitPage({ params }: UnitPageProps) {
  const { semester, subject, unit } = await params;

  const semesterNumber = Number(semester);
  const unitNumber = Number(unit);

  if (
    !Number.isInteger(semesterNumber) ||
    semesterNumber < 1 ||
    semesterNumber > 8 ||
    !Number.isInteger(unitNumber) ||
    unitNumber < 1
  ) {
    notFound();
  }

  const unitData = await prisma.unit.findFirst({
    where: {
      number: unitNumber,
      subject: {
        slug: subject,
        semester: {
          number: semesterNumber,
        },
      },
    },
    include: {
      resources: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!unitData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "semesters", href: "/semesters" },
            {
              label: `Semester ${semesterNumber}`,
              href: `/semesters/${semesterNumber}`,
            },
            {
              label: ` ${subject}`,
              href: `/semesters/${semesterNumber}/${subject}`,
            },
            { label: `Unit ${unitData.number}: ${unitData.title}` },
          ]}
        />

        {/* Header */}
        <div className="mt-8 max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">
            Unit {unitData.number}
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            {unitData.title}
          </h1>

          {unitData.description && (
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {unitData.description}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-7 flex flex-wrap gap-3">
          {unitData.difficulty && (
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                unitData.difficulty === "Beginner"
                  ? "bg-emerald-50 text-emerald-700"
                  : unitData.difficulty === "Intermediate"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-rose-50 text-rose-700"
              }`}
            >
              {unitData.difficulty}
            </span>
          )}

          {unitData.duration && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              ⏱ {unitData.duration}
            </span>
          )}

          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            📚 {unitData.resources.length}{" "}
            {unitData.resources.length === 1 ? "resource" : "resources"}
          </span>
        </div>

        {/* Resources */}
        <section className="mt-12">
          <p className="text-sm font-semibold text-blue-600">Study Materials</p>

          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Learning Resources
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Use these resources to complete this unit.
          </p>

          {unitData.resources.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                📚
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-950">
                Resources coming soon
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Study materials for this unit will be available once they are
                added.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {unitData.resources.map((resource) => (
                <article
                  key={resource.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  {/* Resource Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
                        resource.type === "HANDWRITTEN"
                          ? "bg-amber-50"
                          : resource.type === "PDF"
                            ? "bg-red-50"
                            : resource.type === "EXTERNAL"
                              ? "bg-blue-50"
                              : "bg-rose-50"
                      }`}
                    >
                      {getResourceIcon(resource.type)}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        resource.type === "HANDWRITTEN"
                          ? "bg-amber-50 text-amber-700"
                          : resource.type === "PDF"
                            ? "bg-red-50 text-red-700"
                            : resource.type === "EXTERNAL"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {getResourceLabel(resource.type)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  {resource.description ? (
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                      {resource.description}
                    </p>
                  ) : (
                    <p className="mt-2 flex-1 text-sm text-slate-400">
                      Study material for this unit.
                    </p>
                  )}

                  {/* Action */}
                  <div className="mt-6">
                    {resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        {getResourceAction(resource.type)}

                        <span className="ml-2 transition-transform group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span className="inline-flex w-full items-center justify-center rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500">
                        Resource coming soon
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
