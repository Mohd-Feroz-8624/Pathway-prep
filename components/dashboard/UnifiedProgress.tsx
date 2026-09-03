import Link from "next/link";
type UnifiedProgressProps = {
  progress: number;
  roadmapPercentage: number | null;
  dsaPercentage: number | null;
  interviewPercentage: number | null;
  resumePercentage: number | null;
};

const components = [
  {
    key: "roadmap",
    label: "Roadmap",
    description: "Tasks completed",
    valueKey: "roadmapPercentage",
  },
  {
    key: "dsa",
    label: "DSA",
    description: "Questions solved",
    valueKey: "dsaPercentage",
  },
  {
    key: "interview",
    label: "Interview",
    description: "Performance ",
    valueKey: "interviewPercentage",
  },
  {
    key: "resume",
    label: "Resume",
    description: "ATS score",
    valueKey: "resumePercentage",
  },
] as const;

export default function UnifiedProgress({
  progress,
  roadmapPercentage,
  dsaPercentage,
  interviewPercentage,
  resumePercentage,
}: UnifiedProgressProps) {
  const status =
    progress >= 80
      ? "Excellent"
      : progress >= 60
        ? "Good"
        : progress >= 40
          ? "Needs Improvement"
          : "Getting Started";
  const values = {
    roadmapPercentage,
    dsaPercentage,
    interviewPercentage,
    resumePercentage,
  };

  const availableComponents = components
    .map((component) => ({
      ...component,
      value: values[component.valueKey],
    }))
    .filter(
      (component): component is typeof component & { value: number } =>
        component.value !== null,
    );

  const weakestComponent =
    availableComponents.length > 0
      ? availableComponents.reduce((weakest, current) =>
          current.value < weakest.value ? current : weakest,
        )
      : null;

  return (
    <section className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">
          Career Readiness
        </p>
        <div className="mt-1 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="wrap-words text-2xl font-semibold">
              Your Overall Progress
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Combined performance across your preparation areas.
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold">{progress}%</span>

            <p className="text-sm font-medium text-muted-foreground">
              {status}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {weakestComponent && (
        <div className="mb-6 flex min-w-0 flex-col gap-4 rounded-lg border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          {" "}
          <div className="min-w-0">
            <p className="text-sm font-medium">
              Focus area: {weakestComponent.label}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your current lowest score is {weakestComponent.value}%. Consider
              spending more time improving this area.
            </p>
          </div>
          <Link
            href={
              weakestComponent.key === "roadmap"
                ? "/roadmaps"
                : weakestComponent.key === "dsa"
                  ? "/dsa"
                  : weakestComponent.key === "interview"
                    ? "/interview"
                    : "/resume"
            }
            className="inline-flex w-full shrink-0 items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-blue-700 sm:w-auto"
          >
            {weakestComponent.key === "roadmap"
              ? "Continue Roadmap"
              : weakestComponent.key === "dsa"
                ? "Practice DSA"
                : weakestComponent.key === "interview"
                  ? "Practice Interview"
                  : "Improve Resume"}
          </Link>
        </div>
      )}
      <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {components.map((component) => {
          const value = values[component.valueKey];

          return (
            <div
              key={component.key}
              className="w-full min-w-0 rounded-lg border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{component.label}</h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {component.description}
                  </p>
                </div>

                <span className="text-lg font-semibold">
                  {value !== null ? `${value}%` : "—"}
                </span>
              </div>

              {value !== null && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
              )}

              {value === null && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Not started yet
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
