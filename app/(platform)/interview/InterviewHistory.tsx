"use client";

import { useState } from "react";
import Link from "next/link";

type Interview = {
  id: string;
  role: string;
  difficulty: string;
  type: string;
  createdAt: string;
  overallScore: number | null;
};

type InterviewHistoryProps = {
  interviews: Interview[];
};

export default function InterviewHistory({
  interviews,
}: InterviewHistoryProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleInterviews = showAll ? interviews : interviews.slice(0, 4);

  if (interviews.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <div className="text-4xl">🎤</div>

        <h3 className="mt-4 text-lg font-bold text-slate-950">
          No completed interviews yet
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Complete your first AI mock interview to see your performance here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 space-y-4">
        {visibleInterviews.map((interview) => (
          <article
            key={interview.id}
            className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-slate-950">
                  {interview.role}
                </h3>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {interview.type}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {interview.difficulty}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {formatDate(interview.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400">SCORE</p>

                <p className="text-xl font-bold text-slate-950">
                  {interview.overallScore !== null
                    ? `${interview.overallScore}/100`
                    : "--"}
                </p>
              </div>

              <Link
                href={`/interview/${interview.id}/result`}
                className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Result
              </Link>
            </div>
          </article>
        ))}
      </div>

      {interviews.length > 4 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
