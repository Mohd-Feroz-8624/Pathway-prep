import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import PublishDSAQuestionButton from "./PublishDSAQuestionButton";
import DeleteDSAQuestionButton from "./DeleteDSAQuestionButton";

export default async function AdminDSAPage() {
  await requireAdmin();

  const questions = await prisma.dSAQuestion.findMany({
    orderBy: [
      {
        isPublished: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">Admin Panel</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              DSA Questions
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create and manage the DSA questions available to students.
            </p>
          </div>

          <Link
            href="/admin/dsa/new"
            className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Add Question
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {questions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-slate-950">
                No DSA questions yet
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Create your first DSA question to make it available for
                students.
              </p>

              <Link
                href="/admin/dsa/new"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create Question
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      S.No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {questions.map((question, index) => (
                    <tr key={question.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">
                          {question.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {question.slug}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {question.topic}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {question.difficulty}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              question.isPublished
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {question.isPublished ? "Published" : "Draft"}
                          </span>
                          <Link
                            href={`/admin/dsa/${question.id}/edit`}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </Link>
                          <PublishDSAQuestionButton
                            questionId={question.id}
                            isPublished={question.isPublished}
                          />
                          <DeleteDSAQuestionButton
                            questionId={question.id}
                            questionTitle={question.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
