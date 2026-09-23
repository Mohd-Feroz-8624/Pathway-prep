"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const roles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "SDE",
];

type AnalyzeResumeButtonProps = {
  resumeId: string;
};

export default function AnalyzeResumeButton({
  resumeId,
}: AnalyzeResumeButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setError("");
    setIsAnalyzing(true);

    try {
      const response = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume.");
      }

      setIsOpen(false);

      router.push(`/resume/${resumeId}/analysis`);
    } catch (error) {
      console.error("Resume analysis error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to analyze resume.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Analyze Resume
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  ATS Analysis
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  Analyze Your Resume
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isAnalyzing}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Select the role you are targeting. Your resume will be evaluated
              against that role.
            </p>

            <div className="mt-6">
              <label
                htmlFor="targetRole"
                className="text-sm font-semibold text-slate-700"
              >
                Target Role
              </label>

              <select
                id="targetRole"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                disabled={isAnalyzing}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isAnalyzing}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
