import Link from "next/link";

const actions = [
  {
    title: "Continue Roadmap",
    description: "Continue your current learning path.",
    href: "/roadmaps",
  },
  {
    title: "Explore Roadmaps",
    description: "Find a roadmap for your career goal.",
    href: "/roadmaps",
  },
  {
    title: "Update Profile",
    description: "Keep your student information updated.",
    href: "/profile",
  },
];

export default function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <h3 className="font-bold text-slate-950">{action.title}</h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {action.description}
          </p>

          <span className="mt-4 inline-block text-sm font-semibold text-blue-600">
            Open →
          </span>
        </Link>
      ))}
    </div>
  );
}
