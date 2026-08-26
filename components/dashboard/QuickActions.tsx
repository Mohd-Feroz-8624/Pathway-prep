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
];

export default function QuickActions() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-950">Quick Actions</h2>

        <p className="mt-1 text-sm text-slate-500">
          Jump back into your preparation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <h3 className="font-bold text-slate-950">{action.title}</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
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
