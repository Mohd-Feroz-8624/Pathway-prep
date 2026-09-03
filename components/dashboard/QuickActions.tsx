import Link from "next/link";

const actions = [
  {
    title: "Continue Where I Stopped",
    description: "Pick up your learning from where you last left off.",
    href: "/semesters",
  },
  {
    title: "Explore Roadmaps",
    description: "Find a roadmap that matches your career goal.",
    href: "/roadmaps",
  },
  {
    title: "Practice DSA",
    description: "Strengthen your problem-solving skills with DSA.",
    href: "/dsa",
  },
  {
    title: "Prepare for Interviews",
    description: "Practice your interview skills with real-time feedback.",
    href: "/interview",
  },
  {
    title: "create Resume",
    description: "Create a professional resume that stands out.",
    href: "/resume",
  },
];

export default function QuickActions() {
  return (
    <section className="min-w-0">
      <div className="mb-4">
        <h2 className="wrap-break-words text-2xl font-bold text-slate-950">
          Quick Actions
        </h2>

        <p className="mt-1 wrap-break-words text-sm text-slate-500">
          Jump back into your preparation.
        </p>
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md sm:p-6"
          >
            <h3 className="wrap-break-words font-bold text-slate-950">
              {action.title}
            </h3>

            <p className="mt-2 wrap-break-words text-sm leading-6 text-slate-500">
              {action.description}
            </p>

            <span className="mt-4 inline-block text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
              Continue →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
