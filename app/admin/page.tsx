import Link from "next/link";

import { requireAdmin } from "@/lib/admin";

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="text-sm font-semibold text-blue-600">Administration</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-lg text-slate-600">
          Welcome back, {user.name ?? "Admin"}.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/academic"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
              📚
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Academic Content
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Manage semesters, subjects, units, and academic resources.
            </p>
          </Link>

         
          
          <Link
            href="/admin/roadmaps"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
              🗺️
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Roadmap Management
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create roadmaps, manage stages, and add tasks for students.
            </p>

            <span className="mt-5 inline-block rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              Manage Roadmaps →
            </span>
          </Link>


          <Link
            href="/admin/templates"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-xl">
              📄
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Resume Templates
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create, edit, publish, and manage resume templates for students.
            </p>

            <span className="mt-5 inline-block rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
              Manage Templates →
            </span>
          </Link>
          
          <Link
            href="/admin/reports"
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-950">
              Reports & Issues
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review student reports, missing content, technical issues, and
              feature requests.
            </p>

            <span className="mt-5 inline-block rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              View Reports →
            </span>
          </Link>
          
        </div>
      </section>
    </main>
  );
}
