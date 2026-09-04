import Link from "next/link";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import CreateStageForm from "./CreateStageForm";
import StageActions from "./StageActions";
import TaskForm from "./TaskForm";

type Props = {
  params: Promise<{
    roadmapId: string;
  }>;
};

export default async function AdminRoadmapDetailPage({ params }: Props) {
  await requireAdmin();

  const { roadmapId } = await params;

  const roadmap = await prisma.roadmap.findUnique({
    where: {
      id: roadmapId,
    },
    include: {
      stages: {
        orderBy: {
          order: "asc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      },
    },
  });

  if (!roadmap) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">
              Roadmap not found
            </h1>

            <Link
              href="/admin/roadmaps"
              className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to Roadmaps
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link
          href="/admin/roadmaps"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Roadmaps
        </Link>

        <div className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Roadmap Management
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {roadmap.title}
              </h1>

              {roadmap.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  {roadmap.description}
                </p>
              )}
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                roadmap.isPublished
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {roadmap.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Add Stage</h2>

            <p className="mt-1 text-sm text-slate-500">
              Add the next stage to this roadmap.
            </p>

            <div className="mt-6">
              <CreateStageForm roadmapId={roadmap.id} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950">Stages</h2>

            {roadmap.stages.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="font-semibold text-slate-900">No stages yet</p>

                <p className="mt-2 text-sm text-slate-500">
                  Add the first stage using the form.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {roadmap.stages.map((stage) => (
                  <article
                    key={stage.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                        {stage.order}
                      </div>

                      <div className="min-w-0">
                        <h3 className="wrap-break-words text-lg font-bold text-slate-950">
                          {stage.title}
                        </h3>

                        {stage.description && (
                          <p className="mt-2 wrap-break-words text-sm leading-6 text-slate-500">
                            {stage.description}
                          </p>
                        )}

                        <p className="mt-3 text-xs font-semibold text-slate-400">
                          {stage._count.tasks}{" "}
                          {stage._count.tasks === 1 ? "Task" : "Tasks"}
                        </p>
                        <StageActions
                          roadmapId={roadmap.id}
                          stageId={stage.id}
                          initialTitle={stage.title}
                          initialDescription={stage.description}
                        />
                        <div className="mt-5 border-t border-slate-100 pt-5">
                          <h4 className="text-sm font-bold text-slate-900">
                            Tasks
                          </h4>

                          {stage._count.tasks === 0 ? (
                            <p className="mt-2 text-sm text-slate-500">
                              No tasks added yet.
                            </p>
                          ) : (
                            <p className="mt-2 text-sm font-medium text-slate-600">
                              {stage._count.tasks}{" "}
                              {stage._count.tasks === 1 ? "task" : "tasks"}{" "}
                              added.
                            </p>
                          )}

                          <div className="mt-4">
                            <TaskForm
                              roadmapId={roadmap.id}
                              stageId={stage.id}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
