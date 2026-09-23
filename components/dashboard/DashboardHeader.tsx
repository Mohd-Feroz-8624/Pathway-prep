type DashboardHeaderProps = {
  name: string | null;
};

export default function DashboardHeader({
  name,
}: DashboardHeaderProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">
        Student Dashboard
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        Welcome back, {name || "Student"} 👋
      </h1>

      <p className="mt-3 text-slate-600">
        Continue your learning journey and track your career progress.
      </p>
    </div>
  );
}