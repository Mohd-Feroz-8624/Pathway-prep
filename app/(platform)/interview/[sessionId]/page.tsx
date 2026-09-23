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

  // Get the interview session and the exact questions
  // that were assigned when the session was created.
  const session = await prisma.interviewSession.findFirst({
    where: {
      id: sessionId,
      userId: user.id,
    },
    include: {
      answers: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          question: {
            select: {
              id: true,
              question: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    notFound();
  }

  // The InterviewAnswer records were created when
  // the interview session started. Therefore, they
  // represent the exact questions assigned to this session.
  const questions = session.answers.map((answer) => ({
    id: answer.question.id,
    question: answer.question.question,
  }));

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">
              No questions available
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              This interview session does not contain any questions.
            </p>
          </div>
        </section>
      </main>
    );
  }

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
