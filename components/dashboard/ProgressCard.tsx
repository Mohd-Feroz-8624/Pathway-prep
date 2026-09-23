type ProgressCardProps = {
  completedTasks: number;
  totalTasks: number;
};

export default function ProgressCard({
  completedTasks,
  totalTasks,
}: ProgressCardProps) {
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            Overall Progress
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-950">{progress}%</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Tasks completed</p>

          <p className="mt-1 font-semibold text-slate-900">
            {completedTasks} / {totalTasks}
          </p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
