"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    title: "Roadmaps",
    href: "/roadmaps",
    icon: "◈",
  },
  {
    title: "Semesters",
    href: "/semesters",
    icon: "▣",
  },
  {
    title: "Notes",
    href: "/notes",
    icon: "▤",
  },
  {
    title: "DSA",
    href: "/dsa",
    icon: "◇",
  },
  {
    title: "Interview Practice",
    href: "/interview",
    icon: "◎ ",
  },
  {
    title: "Resume Builder",
    href: "/dashboard/resume",
    icon: "▱",
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    icon: "▰",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight text-slate-950"
          >
            Pathway<span className="text-blue-600">Prep</span>
          </Link>
        </div>

        {/* Navigation */}
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center text-base">
                {item.icon}
              </span>

              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* Account */}
        <div className="border-t border-slate-200 p-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            <span>◉</span>
            <span>Profile</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
          >
            <span>⚙</span>
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
