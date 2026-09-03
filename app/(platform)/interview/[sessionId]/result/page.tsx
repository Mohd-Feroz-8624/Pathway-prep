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
  const interviewDuration = session.completedAt
    ? Math.max(
        0,
        Math.floor(
          (session.completedAt.getTime() - session.startedAt.getTime()) / 1000,
        ),
      )
    : 0;

  const durationMinutes = Math.floor(interviewDuration / 60);
  const durationSeconds = interviewDuration % 60;

  const formattedDuration =
    durationMinutes > 0
      ? `${durationMinutes} min ${durationSeconds} sec`
      : `${durationSeconds} sec`;

  const performanceLevel =
    result.overallScore >= 80
      ? "Excellent"
      : result.overallScore >= 60
        ? "Good"
        : result.overallScore >= 40
          ? "Needs Improvement"
          : "Poor";

  const performanceMessage =
    result.overallScore >= 80
      ? "You demonstrated strong interview performance. Keep practicing to maintain this level."
      : result.overallScore >= 60
        ? "You have a solid foundation. Focus on your weaker areas to improve further."
        : result.overallScore >= 40
          ? "There are several areas to improve. Review the feedback and practice consistently."
          : "Your fundamentals need more practice. Use the feedback to build your confidence and skills.";
  const scoredAnswers = session.answers.filter(
    (answer) => answer.score !== null,
  );

  const totalQuestions = session.answers.length;

  const averageScore =
    scoredAnswers.length > 0
      ? scoredAnswers.reduce(
          (total, answer) => total + (answer.score ?? 0),
          0,
        ) / scoredAnswers.length
      : 0;

  const strongAnswers = scoredAnswers.filter(
    (answer) => (answer.score ?? 0) >= 8,
  ).length;

  const improvementAnswers = scoredAnswers.filter(
    (answer) => (answer.score ?? 0) < 5,
  ).length;
  const performanceData = session.answers.map((answer, index) => {
    const score = answer.score ?? 0;

    return {
      number: index + 1,
      score,
    };
  });

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

          <div className="mt-5">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                result.overallScore >= 80
                  ? "bg-emerald-50 text-emerald-700"
                  : result.overallScore >= 60
                    ? "bg-blue-50 text-blue-700"
                    : result.overallScore >= 40
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
              }`}
            >
              {performanceLevel}
            </span>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              {performanceMessage}
            </p>
          </div>
        </section>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-semibold text-slate-700">
              Question Performance
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Your score for each interview question.
            </p>
          </div>

          <div className="space-y-4">
            {performanceData.map((item) => {
              const scorePercentage = item.score * 10;

              const scoreLabel =
                item.score >= 8
                  ? "Strong"
                  : item.score >= 5
                    ? "Average"
                    : "Needs improvement";

              const scoreClass =
                item.score >= 8
                  ? "bg-emerald-500"
                  : item.score >= 5
                    ? "bg-amber-500"
                    : "bg-red-500";

              return (
                <div key={item.number}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-700">
                      Question {item.number}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {scoreLabel}
                      </span>

                      <span className="text-sm font-bold text-slate-950">
                        {item.score}/10
                      </span>
                    </div>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all ${scoreClass}`}
                      style={{ width: `${scorePercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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

        {/* Interview Details */}
        <section>
          <div className="mb-4">
            <p className="text-sm font-semibold text-blue-600">
              Interview Details
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Session Overview
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Role</p>

              <p className="mt-2 text-lg font-bold text-slate-950">
                {session.role}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Interview Type</p>

              <p className="mt-2 text-lg font-bold text-slate-950">
                {session.type}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Difficulty</p>

              <p className="mt-2 text-lg font-bold text-slate-950">
                {session.difficulty}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Questions</p>

              <p className="mt-2 text-lg font-bold text-slate-950">
                {totalQuestions}
              </p>
            </div>
          </div>
        </section>

        {/* Interview Analytics */}
        <section>
          <div className="mb-4">
            <p className="text-sm font-semibold text-blue-600">
              Performance Analytics
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Interview Breakdown
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Questions</p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {totalQuestions}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Average Answer</p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {averageScore.toFixed(1)}
                <span className="text-base text-slate-400">/10</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Strong Answers</p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {strongAnswers}
              </p>

              <p className="mt-1 text-xs text-slate-400">Score 8 or higher</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Needs Improvement</p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {improvementAnswers}
              </p>

              <p className="mt-1 text-xs text-slate-400">Score below 5</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Duration</p>

              <p className="mt-2 text-lg font-bold text-slate-950">
                {formattedDuration}
              </p>
            </div>
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
        {/* Next Steps */}
        <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
              🎯
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-700">Next Steps</p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Keep improving your interview performance
              </h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                {result.recommendations ||
                  "Review your detailed feedback, practice your weaker areas, and try another interview."}
              </p>
            </div>
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
