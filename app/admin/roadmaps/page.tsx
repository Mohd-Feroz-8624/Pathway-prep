import Link from "next/link";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import CreateRoadmapForm from "./CreateRoadmapForm";

export default async function AdminRoadmapsPage() {
  await requireAdmin();

  const roadmaps = await prisma.roadmap.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      isPublished: true,
      _count: {
        select: {
          stages: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div>
          <Link
            href="/admin"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Admin Dashboard
          </Link>

          <p className="mt-6 text-sm font-semibold text-blue-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Roadmap Management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Create and manage career roadmaps that students can follow.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Create Roadmap</h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new roadmap for students.
            </p>

            <div className="mt-6">
              <CreateRoadmapForm />
            </div>
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-950">
              Existing Roadmaps
            </h2>

            {roadmaps.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-slate-900">
                  No roadmaps yet
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Create your first roadmap using the form.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {roadmaps.map((roadmap) => (
                  <Link
                    key={roadmap.id}
                    href={`/admin/roadmaps/${roadmap.id}`}
                    className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="wrap-break-words text-lg font-bold text-slate-950">
                          {roadmap.title}
                        </h3>

                        {roadmap.description && (
                          <p className="mt-2 wrap-break-words text-sm leading-6 text-slate-500">
                            {roadmap.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {roadmap._count.stages}{" "}
                            {roadmap._count.stages === 1 ? "Stage" : "Stages"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              roadmap.isPublished
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {roadmap.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs text-slate-400">
                        /{roadmap.slug}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
