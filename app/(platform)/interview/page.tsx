import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import InterviewSetup from "./InterviewSetup";
import { prisma } from "@/lib/prisma";
import InterviewHistory from "./InterviewHistory";

export default async function InterviewPage() {
  const { userId: clerkId } = await auth();

  let completedInterviews = 0;
  let averageScore = 0;
  let bestScore = 0;
  let hasScores = false;

  let interviewHistory: {
    id: string;
    role: string;
    difficulty: string;
    type: string;
    createdAt: string;
    overallScore: number | null;
  }[] = [];

  if (clerkId) {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (user) {
      const sessions = await prisma.interviewSession.findMany({
        where: {
          userId: user.id,
          status: "COMPLETED",
        },
        include: {
          result: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      completedInterviews = sessions.length;

      const scores = sessions
        .map((session) => session.result?.overallScore)
        .filter(
          (score): score is number =>
            typeof score === "number" && Number.isFinite(score),
        );

      hasScores = scores.length > 0;

      if (hasScores) {
        const total = scores.reduce((sum, score) => sum + score, 0);

        averageScore = Math.round(total / scores.length);
        bestScore = Math.max(...scores);
      }

      if (scores.length > 0) {
        const total = scores.reduce((sum, score) => sum + score, 0);

        averageScore = Math.round(total / scores.length);
        bestScore = Math.max(...scores);
      }

      interviewHistory = sessions.map((session) => ({
        id: session.id,
        role: session.role,
        difficulty: session.difficulty,
        type: session.type,
        createdAt: session.createdAt.toISOString(),
        overallScore: session.result?.overallScore ?? null,
      }));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-10 px-6 py-10 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">
            Interview Preparation
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Interview Practice
          </h1>

          <p className="mt-3 text-lg leading-8 text-slate-600">
            Practice realistic interviews, improve your answers, and prepare
            yourself for your next opportunity.
          </p>
        </div>

        {/* Main Interview Card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  🎤
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    AI Mock Interview
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Practice a realistic interview with an AI interviewer.
                    Questions will be tailored to your selected role and
                    difficulty.
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                Available
              </span>
            </div>

            <InterviewSetup />
          </div>
        </section>

        {/* Interview Activity */}
        <section>
          <div>
            <p className="text-sm font-semibold text-blue-600">Your Progress</p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Interview Activity
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Track your interview practice and performance over time.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {/* Interviews */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🎯
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Interviews Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {completedInterviews}
              </p>
            </div>

            {/* Average Score */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                📊
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Average Score
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {hasScores ? `${averageScore}/100` : "--"}
              </p>
            </div>

            {/* Best Score */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                🏆
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Best Score
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {hasScores ? `${bestScore}/100` : "--"}
              </p>
            </div>
          </div>
        </section>

        {/* Interview History */}
        <section>
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Previous Interviews
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Interview History
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Review your previous interviews and AI-generated results.
            </p>
          </div>

          <InterviewHistory interviews={interviewHistory} />
        </section>

        {/* Career Preparation CTAs */}
        <section className="grid gap-5 md:grid-cols-2">
          {/* Roadmaps */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
              🧭
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              Follow Your Roadmap
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Follow a structured career path, build the right skills, and
              prepare yourself for your target role.
            </p>

            <Link
              href="/roadmaps"
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              View Roadmaps
              <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Resume Builder */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
              📄
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              Create a Professional Resume
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Build a compelling resume that showcases your skills and
              experience.
            </p>

            <Link
              href="/resume-builder"
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Build Your Resume
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

       
      </section>
    </main>
  );
}
