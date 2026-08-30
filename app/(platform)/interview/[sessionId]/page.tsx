import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import InterviewSession from "./InterviewSession";

type InterviewPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function InterviewSessionPage({
  params,
}: InterviewPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { sessionId } = await params;

  // Get the interview session
  const session = await prisma.interviewSession.findFirst({
    where: {
      id: sessionId,
      userId: user.id,
    },
  });

  if (!session) {
    notFound();
  }

  // Get questions directly from the question bank
  const questions = await prisma.interviewQuestion.findMany({
    where: {
      role: session.role,
      difficulty: session.difficulty,
      isActive: true,
      ...(session.type === "Mixed"
        ? {}
        : {
            type: session.type,
          }),
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 5,
    select: {
      id: true,
      question: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">
            Interview Practice
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            {session.role} Interview
          </h1>

          <p className="mt-3 text-lg leading-8 text-slate-600">
            {session.difficulty} · {session.type} interview
          </p>
        </div>

        {/* Status */}
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {session.difficulty}
          </span>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {session.type}
          </span>

          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            {questions.length} Questions
          </span>
        </div>

        {/* Interview */}
        <InterviewSession sessionId={session.id} questions={questions} />
      </section>
    </main>
  );
}
