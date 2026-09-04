import Link from "next/link";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import CreateStageForm from "./CreateStageForm";
import StageActions from "./StageActions";
import TaskForm from "./TaskForm";
import TaskActions from "./TaskActions";
import RoadmapActions from "../RoadmapActions";

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
          tasks: {
            orderBy: {
              order: "asc",
            },
            select: {
              id: true,
              title: true,
              description: true,
              order: true,
              isRequired: true,
              resourceUrl: true,
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
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-600">
                Roadmap Management
              </p>

              <h1 className="mt-2 wrap-break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {roadmap.title}
              </h1>

              {roadmap.description && (
                <p className="mt-3 max-w-2xl wrap-break-words text-sm leading-6 text-slate-600 sm:text-base">
                  {roadmap.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {roadmap.category && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {roadmap.category}
                  </span>
                )}

                {roadmap.duration && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {roadmap.duration}
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {roadmap.stages.length}{" "}
                  {roadmap.stages.length === 1 ? "Stage" : "Stages"}
                </span>
              </div>

              <RoadmapActions
                roadmapId={roadmap.id}
                initialTitle={roadmap.title}
                initialSlug={roadmap.slug}
                initialDescription={roadmap.description}
                initialCategory={roadmap.category}
                initialDuration={roadmap.duration}
                initialPublished={roadmap.isPublished}
              />
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

                      <div className="min-w-0 flex-1">
                        <h3 className="wrap-break-words text-lg font-bold text-slate-950">
                          {stage.title}
                        </h3>

                        {stage.description && (
                          <p className="mt-2 wrap-break-words text-sm leading-6 text-slate-500">
                            {stage.description}
                          </p>
                        )}

                        <p className="mt-3 text-xs font-semibold text-slate-400">
                          {stage.tasks.length}{" "}
                          {stage.tasks.length === 1 ? "Task" : "Tasks"}
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

                          {stage.tasks.length === 0 ? (
                            <p className="mt-2 text-sm text-slate-500">
                              No tasks added yet.
                            </p>
                          ) : (
                            <div className="mt-4 space-y-3">
                              {stage.tasks.map((task) => (
                                <div
                                  key={task.id}
                                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600">
                                      {task.order}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h5 className="wrap-break-words text-sm font-bold text-slate-900">
                                          {task.title}
                                        </h5>

                                        <span
                                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                            task.isRequired
                                              ? "bg-blue-50 text-blue-700"
                                              : "bg-slate-100 text-slate-500"
                                          }`}
                                        >
                                          {task.isRequired
                                            ? "Required"
                                            : "Optional"}
                                        </span>
                                      </div>

                                      {task.description && (
                                        <p className="mt-1 wrap-break-words text-sm leading-5 text-slate-500">
                                          {task.description}
                                        </p>
                                      )}

                                      {task.resourceUrl && (
                                        <a
                                          href={task.resourceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="mt-2 inline-block max-w-full truncate text-xs font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                          {task.resourceUrl}
                                        </a>
                                      )}

                                      <TaskActions
                                        roadmapId={roadmap.id}
                                        stageId={stage.id}
                                        taskId={task.id}
                                        initialTitle={task.title}
                                        initialDescription={task.description}
                                        initialResourceUrl={task.resourceUrl}
                                        initialRequired={task.isRequired}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
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
