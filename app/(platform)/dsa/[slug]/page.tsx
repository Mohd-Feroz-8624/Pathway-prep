import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type DsaQuestionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DsaQuestionPage({
  params,
}: DsaQuestionPageProps) {
  const { slug } = await params;

  const question = await prisma.dSAQuestion.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      difficulty: true,
      topic: true,
      constraints: true,
      examples: true,
    },
  });

  if (!question) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Back */}
        <Link
          href="/dsa"
          className="inline-flex items-center text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          ← Back to DSA Practice
        </Link>

        {/* Question Header */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {question.topic}
            </span>

            <DifficultyBadge difficulty={question.difficulty} />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
            {question.title}
          </h1>
        </div>

        {/* Problem */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-950">Problem</h2>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
            {question.description}
          </p>
        </section>

        {/* Examples */}
        {question.examples && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">Examples</h2>

            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
              {question.examples}
            </pre>
          </section>
        )}

        {/* Constraints */}
        {question.constraints && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">Constraints</h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {question.constraints}
            </p>
          </section>
        )}

        {/* Start Solving */}
        <div className="mt-8 flex justify-end">
          <Link
            href={`/dsa/${slug}/solve`}
            className="inline-flex items-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Start Solving
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  if (difficulty === "Easy") {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Easy
      </span>
    );
  }

  if (difficulty === "Medium") {
    return (
      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        Medium
      </span>
    );
  }

  return (
    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
      Hard
    </span>
  );
}
