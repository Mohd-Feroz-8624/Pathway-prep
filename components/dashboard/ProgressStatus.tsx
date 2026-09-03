type ProgressStatusProps = {
  progress: number;
  weakestArea: string | null;
  recommendation: string;
};

export default function ProgressStatus({
  progress,
  weakestArea,
  recommendation,
}: ProgressStatusProps) {
  let status = "Getting Started";
  let message = "Start building your preparation step by step.";

  if (progress >= 90) {
    status = "Career Ready";
    message =
      "Excellent work. You have built strong preparation across multiple areas.";
  } else if (progress >= 75) {
    status = "Almost Career Ready";
    message =
      "You're close. Keep improving your weaker areas to become placement ready.";
  } else if (progress >= 50) {
    status = "Good Progress";
    message =
      "You're making solid progress. Keep working consistently across your preparation.";
  } else if (progress >= 25) {
    status = "Building Momentum";
    message =
      "You're on the right track. Continue completing tasks and improving your skills.";
  }

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Preparation Status
          </p>

          <h2 className="mt-1 text-2xl font-bold">{status}</h2>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {message}
          </p>
        </div>

        <div className="rounded-xl border bg-background px-5 py-4 text-center">
          <p className="text-3xl font-bold">{progress}%</p>
          <p className="text-xs text-muted-foreground">Career Readiness</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-muted/50 p-4">
        <p className="text-sm font-semibold">Next Recommended Action</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {weakestArea
            ? `Focus on improving your ${weakestArea} preparation.`
            : recommendation}
        </p>
      </div>
    </section>
  );
}
