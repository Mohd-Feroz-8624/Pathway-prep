import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import SolveEditor from "./SolveEditor";
import SubmissionHistory from "./SubmissionHistory";

type SolvePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SolvePage({ params }: SolvePageProps) {
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
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    notFound();
  }
  const submissions = await prisma.dSASubmission.findMany({
    where: {
      questionId: question.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      code: true,
      language: true,
      status: true,
      score: true,
      createdAt: true,
    },
  });
  const submissionHistory = submissions.map((submission) => ({
    ...submission,
    createdAt: submission.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">DSA Practice</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              {question.title}
            </h1>
          </div>

          <Link
            href="/dsa"
            className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            ← Back to DSA
          </Link>
        </div>

        {/* Problem + Editor */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Problem */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {question.topic}
              </span>

              <DifficultyBadge difficulty={question.difficulty} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-950">Problem</h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {question.description}
            </p>

            {question.examples && (
              <>
                <h3 className="mt-8 text-lg font-bold text-slate-950">
                  Examples
                </h3>

                <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
                  {question.examples}
                </pre>
              </>
            )}

            {question.constraints && (
              <>
                <h3 className="mt-8 text-lg font-bold text-slate-950">
                  Constraints
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {question.constraints}
                </p>
              </>
            )}
          </section>

          {/* Editor */}
          <div>
            <SolveEditor questionId={question.id} />
          </div>
        </div>

        <div className="mt-8">
          <SubmissionHistory submissions={submissionHistory} />
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
