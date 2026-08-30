import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import MarkSolvedButton from "./MarkSolvedButton";

type DsaQuestionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DsaQuestionPage({
  params,
}: DsaQuestionPageProps) {
  const { slug } = await params;

  // Get logged-in Clerk user
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    notFound();
  }

  // Find corresponding database user
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

  // Get DSA question and current user's progress
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
      concept: true,
      approach: true,
      timeComplexity: true,
      spaceComplexity: true,
      javaSolution: true,
      pythonSolution: true,
      javascriptSolution: true,
      cppSolution: true,

      progress: {
        where: {
          userId: user.id,
        },
        select: {
          solved: true,
        },
      },
    },
  });

  if (!question) {
    notFound();
  }

  const alreadySolved = question.progress.some((progress) => progress.solved);

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

        {/* Concept */}
        {question.concept && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">Concept</h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {question.concept}
            </p>
          </section>
        )}

        {/* Approach */}
        {question.approach && (
          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-950">Approach</h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {question.approach}
            </p>
          </section>
        )}

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

        {/* Complexity */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-950">
            Complexity Analysis
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* Time Complexity */}
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Time Complexity
              </p>

              <p className="mt-2 font-mono text-lg font-bold text-slate-950">
                {question.timeComplexity ?? "Not available"}
              </p>
            </div>

            {/* Space Complexity */}
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Space Complexity
              </p>

              <p className="mt-2 font-mono text-lg font-bold text-slate-950">
                {question.spaceComplexity ?? "Not available"}
              </p>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-950">Solutions</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Study the implementation in your preferred programming language.
          </p>

          {/* Java */}
          {question.javaSolution && (
            <SolutionBlock language="Java" code={question.javaSolution} />
          )}

          {/* Python */}
          {question.pythonSolution && (
            <SolutionBlock language="Python" code={question.pythonSolution} />
          )}

          {/* JavaScript */}
          {question.javascriptSolution && (
            <SolutionBlock
              language="JavaScript"
              code={question.javascriptSolution}
            />
          )}

          {/* C++ */}
          {question.cppSolution && (
            <SolutionBlock language="C++" code={question.cppSolution} />
          )}
        </section>

        {/* Mark as Solved */}
        <div className="mt-8 flex justify-end">
          <MarkSolvedButton
            questionId={question.id}
            alreadySolved={alreadySolved}
          />
        </div>
      </section>
    </main>
  );
}

function SolutionBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-sm font-bold text-slate-800">{language}</p>
      </div>

      <pre className="overflow-x-auto bg-slate-950 p-5 text-sm leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
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
