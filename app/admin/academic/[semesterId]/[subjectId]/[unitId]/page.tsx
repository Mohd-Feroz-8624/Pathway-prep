import Link from "next/link";
import { notFound } from "next/navigation";


import ResourceManager from "./ResourceManager";
import DeleteResourceButton from "./DeleteResourceButton";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import EditResourceButton from "./EditResponceButton";

type UnitPageProps = {
  params: Promise<{
    semesterId: string;
    subjectId: string;
    unitId: string;
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
      return "PDF";
    case "EXTERNAL":
      return "External Resource";
    case "YOUTUBE":
      return "YouTube Video";
    default:
      return "Resource";
  }
}

export default async function AdminUnitPage({ params }: UnitPageProps) {
  await requireAdmin();

  const { semesterId, subjectId, unitId } = await params;

  const unit = await prisma.unit.findFirst({
    where: {
      id: unitId,
      subjectId,
      subject: {
        semesterId,
      },
    },
    include: {
      subject: {
        include: {
          semester: true,
        },
      },
      resources: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!unit) {
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
            Semester {unit.subject.semester.number}
          </Link>

          <span>/</span>

          <Link
            href={`/admin/academic/${semesterId}/${subjectId}`}
            className="transition hover:text-blue-600"
          >
            {unit.subject.name}
          </Link>

          <span>/</span>

          <span className="font-medium text-slate-700">Unit {unit.number}</span>
        </div>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Unit {unit.number}
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
              {unit.title}
            </h1>

            {unit.description && (
              <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
                {unit.description}
              </p>
            )}
          </div>

          <ResourceManager unitId={unit.id} />
        </div>

        {/* Resources */}
        <section className="mt-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Learning Resources
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage resources available to students for this unit.
            </p>
          </div>

          {unit.resources.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                📚
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-950">
                No resources yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Add handwritten notes, PDFs, external resources, or YouTube
                videos for this unit.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {unit.resources.map((resource) => (
                <article
                  key={resource.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      {getResourceIcon(resource.type)}
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {getResourceLabel(resource.type)}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {resource.title}
                  </h3>

                  {resource.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {resource.description}
                    </p>
                  )}

                  {resource.url && (
                    <p className="mt-4 truncate text-xs text-slate-400">
                      {resource.url}
                    </p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <EditResourceButton resource={resource} />

                    <DeleteResourceButton resourceId={resource.id} />
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
