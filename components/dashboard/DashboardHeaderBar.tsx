"use client";

import { useState } from "react";
import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import UserAvatar from "./UserAvatar";

const navigation = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Semesters", href: "/semesters" },
  { title: "DSA", href: "/dsa" },
  { title: "Roadmaps", href: "/roadmaps" },
  { title: "Resume Builder", href: "/resume" },
  { title: "Interview Practice", href: "/interview" },
];

export default function DashboardHeaderBar() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Open navigation"
          >
            ☰
          </button>

          <Link href="/dashboard" className="text-lg font-bold text-slate-950">
            Pathway<span className="text-blue-600">Prep</span>
          </Link>

          <Link
            href="/profile"
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Profile"
          >
            <UserAvatar name={user?.fullName} size="sm" />
          </Link>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/40"
            aria-label="Close navigation"
          />

          <aside className="relative h-full w-72 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-lg font-bold text-slate-950"
              >
                Pathway<span className="text-blue-600">Prep</span>
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Close navigation"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-1 p-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.title}
                </Link>
              ))}
              <div className="mt-4 border-t border-slate-200 pt-4">
                <SignOutButton>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </SignOutButton>
                <Link
                  href="/contact"
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                >
                  <span>Contact</span>
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
