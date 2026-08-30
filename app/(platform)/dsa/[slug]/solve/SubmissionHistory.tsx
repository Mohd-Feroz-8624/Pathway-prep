"use client";

import { useState } from "react";

type Submission = {
  id: string;
  code: string;
  language: string;
  status: string;
  score: number | null;
  createdAt: string; // Changed to string to handle serialization
};

type SubmissionHistoryProps = {
  submissions: Submission[];
};

export default function SubmissionHistory({
  submissions,
}: SubmissionHistoryProps) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  if (submissions.length === 0) {
    return (
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-slate-950">Your Submissions</h2>

        <p className="mt-2 text-sm text-slate-500">
          Your submissions for this problem will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-xl font-bold text-slate-950">Your Submissions</h2>

        <p className="mt-2 text-sm text-slate-500">
          Your previous attempts for this problem.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {submission.language}
              </span>

              <StatusBadge status={submission.status} />

              <span className="text-xs text-slate-500">
                {new Date(submission.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-600">
                Score: {submission.score ?? "--"}
              </span>

              <button
                type="button"
                onClick={() => setSelectedCode(submission.code)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                View Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCode !== null && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-950">Submitted Code</h3>

            <button
              type="button"
              onClick={() => setSelectedCode(null)}
              className="text-sm font-semibold text-slate-500 hover:text-slate-950"
            >
              Close
            </button>
          </div>

          <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-100">
            {selectedCode}
          </pre>
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ACCEPTED") {
    return (
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        Accepted
      </span>
    );
  }

  if (status === "WRONG_ANSWER") {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        Wrong Answer
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
      {status}
    </span>
  );
}
