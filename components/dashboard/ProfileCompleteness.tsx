import Link from "next/link";

type ProfileCompletenessProps = {
  name: string | null;
  college: string | null;
  branch: string | null;
  currentSemester: number | null;
  careerGoal: string | null;
  github: string | null;
  linkedin: string | null;
};

export default function ProfileCompleteness({
  name,
  college,
  branch,
  currentSemester,
  careerGoal,
  github,
  linkedin,
}: ProfileCompletenessProps) {
  const fields = [
    name,
    college,
    branch,
    currentSemester,
    careerGoal,
    github,
    linkedin,
  ];

  const completedFields = fields.filter(Boolean).length;

  const percentage = Math.round((completedFields / fields.length) * 100);

  if (percentage === 100) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Complete your profile
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-950">
            You&apos;re {percentage}% ready
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add the remaining information to personalize your Pathway Prep
            experience.
          </p>
        </div>

        <span className="text-2xl font-bold text-blue-600">{percentage}%</span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <Link
        href="/profile"
        className="mt-5 inline-flex rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Complete Profile →
      </Link>
    </div>
  );
}
