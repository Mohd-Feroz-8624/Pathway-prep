import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import DsaQuestionList from "./DsaQuestionList";

export default async function DsaPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
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
    return null;
  }

  const questions = await prisma.dSAQuestion.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      difficulty: true,
      topic: true,
    },
  });

  const solvedCount = await prisma.dSAProgress.count({
    where: {
      userId: user.id,
      solved: true,
    },
  });

  const easyCount = questions.filter(
    (question) => question.difficulty === "Easy",
  ).length;

  const mediumCount = questions.filter(
    (question) => question.difficulty === "Medium",
  ).length;

  const hardCount = questions.filter(
    (question) => question.difficulty === "Hard",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">DSA Preparation</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            DSA Practice
          </h1>

          <p className="mt-3 text-lg leading-8 text-slate-600">
            Practice data structures and algorithms problems, improve your
            problem-solving skills, and prepare for technical interviews.
          </p>
        </div>

        {/* Statistics */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total Questions
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {questions.length}
            </p>
          </div>

          {/* Solved */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Problems Solved
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {solvedCount} / {questions.length}
            </p>
          </div>

          {/* Easy */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Easy</p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {easyCount}
            </p>
          </div>

          {/* Medium */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Medium</p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {mediumCount}
            </p>
          </div>

          {/* Hard */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Hard</p>

            <p className="mt-2 text-3xl font-bold text-red-600">{hardCount}</p>
          </div>
        </section>

        {/* Questions */}
        <section>
          <DsaQuestionList questions={questions} />
        </section>
      </section>
    </main>
  );
}
