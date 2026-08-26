"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import {useClerk} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import UserAvatar from "@/components/dashboard/UserAvatar";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    title: "Semesters",
    href: "/semesters",
    icon: "▣",
  },
  {
    title: "DSA",
    href: "/dsa",
    icon: "◇",
  },
  {
    title: "Roadmaps",
    href: "/roadmaps",
    icon: "◈",
  },
  {
    title: "Resume Builder",
    href: "/resume",
    icon: "▱",
  },
  {
    title: "Interview Practice",
    href: "/interview",
    icon: "◎",
  },
];

type DashboardSidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DashboardSidebar({
  collapsed,
  setCollapsed,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<{
    title: string;
    x: number;
    y: number;
  } | null>(null);

  const showItemTooltip = (
    event: React.MouseEvent<HTMLAnchorElement>,
    title: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredItem({
      title,
      x: rect.right + 12,
      y: rect.top + rect.height / 2,
    });
  };
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white transition-all duration-300 lg:block ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="relative flex h-screen flex-col">
        {/* Logo */}
        <div
          className={`flex h-20 items-center border-b border-slate-200 ${
            collapsed ? "justify-center px-3" : "px-6"
          }`}
        >
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight text-slate-950"
            title={collapsed ? "Pathway Prep" : undefined}
          >
            {collapsed ? (
              <span className="text-blue-600">P</span>
            ) : (
              <>
                Pathway<span className="text-blue-600">Prep</span>
              </>
            )}
          </Link>
        </div>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="group absolute -right-5 top-10 z-100 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-medium text-slate-700 shadow-md transition-all duration-200 hover:scale-105 hover:bg-slate-50 hover:text-slate-950"
        >
          <span
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          >
            ←
          </span>

          {/* Premium hover tooltip */}
          <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 ">
            {collapsed ? "Expand" : "Collapse"}

            {/* Arrow on the left side */}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-slate-900 " />
          </span>
        </button>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.title : undefined}
                  onMouseEnter={(event) => {
                    if (!collapsed) return;
                    showItemTooltip(event, item.title);
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                    collapsed ? "justify-center px-3" : "gap-3 px-4"
                  } ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <span className="relative flex h-6 shrink-0 text-base">
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="whitespace-nowrap">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Account Navigation */}
        <div className="border-t border-slate-200 p-3 ">
          <div className="space-y-2 ">
            {/* Profile */}
            <Link
              href="/profile"
              title={collapsed ? "Profile" : undefined}
              className={`flex items-center rounded-xl py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-950 ${
                collapsed ? "justify-center px-3" : "gap-3 px-4"
              }`}
            >
              <UserAvatar name={user?.fullName} size="sm" />

              {!collapsed && <span>Profile</span>}
            </Link>

            {/* Settings */}
            <button
              type="button"
              onClick={() => signOut({ redirectUrl: "/sign-in" })}
              className="flex w-full items-center  gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
            >
              {/* <UserAvatar  /> */}
              <LogOut className="h-6 w-6 ml-4 shrink-0 " />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {collapsed && hoveredItem && (
        <div
          className="pointer-events-none fixed z-120 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-100 shadow-lg"
          style={{ left: hoveredItem.x, top: hoveredItem.y }}
        >
          {hoveredItem.title}
          <span className="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-r-4 border-y-transparent border-r-slate-900" />
        </div>
      )}
    </aside>
  );
}
