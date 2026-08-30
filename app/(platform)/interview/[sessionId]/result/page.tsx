import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type ResultPageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function InterviewResultPage({ params }: ResultPageProps) {
  const { sessionId } = await params;

  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-950">Unauthorized</h1>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-950">User not found</h1>
        </div>
      </main>
    );
  }

  const session = await prisma.interviewSession.findFirst({
    where: {
      id: sessionId,
      userId: user.id,
    },
    include: {
      result: true,
      answers: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!session || !session.result) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-950">
            Interview result not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            We couldn&apos;t find the result for this interview.
          </p>

          <Link
            href="/interview"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Interviews
          </Link>
        </div>
      </main>
    );
  }

  const { result } = session;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl space-y-8 px-6 py-10 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Interview Results
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Your Interview Performance
          </h1>

          <p className="mt-3 text-slate-500">
            Here&apos;s your AI-generated interview evaluation.
          </p>
        </div>

        {/* Overall Score */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Overall Score</p>

          <p className="mt-3 text-6xl font-bold text-slate-950">
            {result.overallScore}
            <span className="text-2xl text-slate-400">/100</span>
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Based on your performance across all interview questions.
          </p>
        </section>

        {/* AI Analysis */}
        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl">💪</div>

            <h2 className="mt-4 text-lg font-bold text-slate-950">Strengths</h2>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
              {result.strengths || "No strengths available."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl">⚠️</div>

            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Weaknesses
            </h2>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
              {result.weaknesses || "No weaknesses available."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-2xl">📈</div>

            <h2 className="mt-4 text-lg font-bold text-slate-950">
              Recommendations
            </h2>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
              {result.recommendations || "No recommendations available."}
            </p>
          </div>
        </section>

        {/* Question Results */}
        <section>
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Detailed Evaluation
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Question-by-Question Results
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            {session.answers.map((answer, index) => (
              <article
                key={answer.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                      {index + 1}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Question
                      </p>

                      <h3 className="mt-2 text-lg font-bold leading-7 text-slate-950">
                        {answer.question.question}
                      </h3>
                    </div>
                  </div>

                  <div className="shrink-0 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                    {answer.score ?? "--"}/10
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <p className="text-sm font-semibold text-slate-700">
                    Your Answer
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
                    {answer.answer}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl bg-blue-50 p-5">
                  <p className="text-sm font-semibold text-blue-800">
                    AI Feedback
                  </p>

                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-blue-900">
                    {answer.feedback || "No feedback available."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row">
          <Link
            href="/interview"
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Practice Again
            <span className="ml-2">→</span>
          </Link>

          <Link
            href="/roadmaps"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            View Roadmaps
          </Link>
        </div>
      </section>
    </main>
  );
}
