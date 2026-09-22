import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

import EditDSAQuestionForm from "./EditDSAQuestionForm";

export default async function EditDSAQuestionPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  await requireAdmin();

  const { questionId } = await params;

  const question = await prisma.dSAQuestion.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!question) {
    notFound();
  }

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
            Edit DSA Question
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the question, explanation, complexity, and solutions.
          </p>
        </div>

        <div className="mt-8">
          <EditDSAQuestionForm question={question} />
        </div>
      </section>
    </main>
  );
}
