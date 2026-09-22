import Link from "next/link";

import { requireAdmin } from "@/lib/admin";
import CreateDSAQuestionForm from "./CreateDsaQuestionForm";


export default async function NewDSAQuestionPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <Link
          href="/admin/dsa"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to DSA Questions
        </Link>

        <div className="mt-6">
          <p className="text-sm font-semibold text-blue-600">Admin Panel</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Add DSA Question
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create a DSA problem with explanations and solutions for students.
          </p>
        </div>

        <div className="mt-8">
          <CreateDSAQuestionForm />
        </div>
      </section>
    </main>
  );
}
