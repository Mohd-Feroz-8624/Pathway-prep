import Link from "next/link";

type ProfileCardProps = {
  name: string | null;
  email: string;
  college: string | null;
  branch: string | null;
  currentSemester: number | null;
  careerGoal: string | null;
  github: string | null;
  linkedin: string | null;
};

export default function ProfileCard({
  name,
  email,
  college,
  branch,
  currentSemester,
  careerGoal,
  github,
  linkedin,
}: ProfileCardProps) {
  const displayName = name || "Student";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
          {initials}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold text-slate-950">
            {displayName}
          </h2>

          <p className="truncate text-sm text-slate-500">{email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            College
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {college || "Not added"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Branch
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {branch || "Not added"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Semester
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {currentSemester ? `Semester ${currentSemester}` : "Not added"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Career Goal
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {careerGoal || "Not added"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              GitHub
            </p>

            {github ? (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View profile →
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Not added</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              LinkedIn
            </p>

            {linkedin ? (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View profile →
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Not added</p>
            )}
          </div>
        </div>
      </div>

      <Link
        href="/profile"
        className="mt-6 block rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Edit Profile
      </Link>
    </div>
  );
}
