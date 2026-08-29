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

const difficulties = ["Beginner", "Intermediate", "Advanced"];

const interviewTypes = ["Technical", "Behavioral", "Mixed"];

export default function InterviewSetup() {
  const router = useRouter();

  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [type, setType] = useState("Technical");

  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  async function handleStartInterview() {
    setError("");
    setIsStarting(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          difficulty,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to start interview.");
        return;
      }

      router.push(`/interview/${data.data.session.id}`);
    } catch (error) {
      console.error("Start interview error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="text-sm font-semibold text-slate-700"
          >
            Role
          </label>

          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            disabled={isStarting}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label
            htmlFor="difficulty"
            className="text-sm font-semibold text-slate-700"
          >
            Difficulty
          </label>

          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            disabled={isStarting}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            {difficulties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Interview Type */}
        <div>
          <label
            htmlFor="interviewType"
            className="text-sm font-semibold text-slate-700"
          >
            Interview Type
          </label>

          <select
            id="interviewType"
            value={type}
            onChange={(event) => setType(event.target.value)}
            disabled={isStarting}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            {interviewTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Start */}
      <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Choose your preferences and start your interview.
        </p>

        <button
          type="button"
          onClick={handleStartInterview}
          disabled={isStarting}
          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isStarting ? "Starting..." : "Start Interview"}
          {!isStarting && <span className="ml-2">→</span>}
        </button>
      </div>
    </div>
  );
}
