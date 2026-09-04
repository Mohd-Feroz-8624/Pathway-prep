import Link from "next/link";

import { requireAdmin } from "@/lib/admin";
import CreateTemplateForm from "./CreateTemplateForm";

export default async function NewTemplatePage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <Link
          href="/admin/templates"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Resume Templates
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-blue-600">Admin Panel</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Create Resume Template
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add a new resume template that can be made available to students.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <CreateTemplateForm />
        </div>
      </section>
    </main>
  );
}
