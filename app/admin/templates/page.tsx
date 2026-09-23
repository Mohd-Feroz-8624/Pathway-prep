import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import Image from "next/image";

export default async function AdminTemplatesPage() {
  await requireAdmin();

  const templates = await prisma.resumeTemplate.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Admin Dashboard
          </Link>

          <div className="mt-5">
            <p className="text-sm font-semibold text-blue-600">Admin Panel</p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Resume Templates
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Create and manage the resume templates available to students.
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Existing Templates
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {templates.length}{" "}
              {templates.length === 1 ? "template" : "templates"} found.
            </p>
          </div>

          <Link
            href="/admin/templates/new"
            className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Template
          </Link>
        </div>

        {templates.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              No templates yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Create your first resume template for students.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {

              return (
                <Link
                key={template.id}
                href={`/admin/templates/${template.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-8.5/11 overflow-hidden bg-slate-100">
                  {template.previewUrl ? (
                    <Image
                      src={template.previewUrl}
                      alt={`${template.name} preview`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-8">
                      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mx-auto h-4 w-32 rounded bg-slate-300" />
                        <div className="mx-auto mt-2 h-2.5 w-40 rounded bg-slate-200" />

                        <div className="mt-8 h-3 w-20 rounded bg-slate-300" />
                        <div className="mt-3 h-2 w-full rounded bg-slate-200" />
                        <div className="mt-2 h-2 w-11/12 rounded bg-slate-200" />
                        <div className="mt-2 h-2 w-4/5 rounded bg-slate-200" />

                        <div className="mt-8 h-3 w-24 rounded bg-slate-300" />
                        <div className="mt-3 h-2 w-full rounded bg-slate-200" />
                        <div className="mt-2 h-2 w-5/6 rounded bg-slate-200" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 wrap-break-words text-lg font-bold text-slate-950">
                      {template.name}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        template.isPublished
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {template.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  {template.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {template.description}
                    </p>
                  )}

                  <p className="mt-4 break-all text-xs text-slate-400">
                    /{template.slug}
                  </p>

                  <div className="mt-5 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    Manage Template →
                  </div>
                </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
