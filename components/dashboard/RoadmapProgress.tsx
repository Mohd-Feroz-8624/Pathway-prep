import Link from "next/link";

type RoadmapProgressProps = {
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
}: RoadmapProgressProps) {
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-950">{title}</h3>

          {description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
        {nextTask && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Next Task
            </p>

            <p className="mt-1 font-semibold text-slate-900">
              {nextTask.title}
            </p>

            {nextTask.stageTitle && (
              <p className="mt-1 text-sm text-slate-500">
                {nextTask.stageTitle}
              </p>
            )}
          </div>
        )}

        <span className="text-lg font-bold text-blue-600">{progress}%</span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {completedTasks} of {totalTasks} tasks completed
        </p>

        <Link
          href={`/roadmaps/${slug}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Continue →
        </Link>
      </div>
    </div>
  );
}
