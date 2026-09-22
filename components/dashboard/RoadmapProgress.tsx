import Link from "next/link";

type ProgressCardProps = {
  title: string;
  description: string | null;
  completedTasks: number;
  totalTasks: number;
  slug: string;
  nextTask: {
    id: string;
    title: string;
    stageTitle: string | null;
  } | null;
};

export default function RoadmapProgress({
  title,
  description,
  completedTasks,
  totalTasks,
  slug,
  nextTask,
}: ProgressCardProps) {
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex min-w-0 flex-col gap-5">
        <div className="min-w-0">
          <h3 className="wrap-break-words text-xl font-bold text-slate-950">
            {title}
          </h3>

          {description && (
            <p className="mt-2 wrap-break-words text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-500">
              Overall Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {progress}%
            </p>
          </div>

          <div className="min-w-0 text-left sm:text-right">
            <p className="text-sm text-slate-500">Tasks completed</p>

            <p className="mt-1 font-semibold text-slate-900">
              {completedTasks} / {totalTasks}
            </p>
          </div>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {nextTask ? (
          <div className="flex min-w-0 flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Next Task
              </p>

              <p className="mt-1 wrap-break-words font-semibold text-slate-900">
                {nextTask.title}
              </p>

              {nextTask.stageTitle && (
                <p className="mt-1 wrap-break-words text-sm text-slate-500">
                  {nextTask.stageTitle}
                </p>
              )}
            </div>

            <Link
              href={`/roadmaps/${slug}`}
              className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Continue
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Roadmap completed 🎉
            </p>

            <p className="mt-1 text-sm text-slate-500">
              You have completed all available tasks in this roadmap.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
