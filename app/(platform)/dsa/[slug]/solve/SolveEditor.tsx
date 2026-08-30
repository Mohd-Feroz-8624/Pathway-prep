"use client";

import { useState } from "react";

type SolveEditorProps = {
  questionId: string;
};

export default function SolveEditor({ questionId }: SolveEditorProps) {
  const [code, setCode] = useState(`// Write your solution here\n\n`);
  const [language, setLanguage] = useState("Java");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!code.trim()) {
      return;
    }

    setLoading(true);
    setSubmitted(false);
    setError("");

    try {
      const response = await fetch("/api/dsa/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          code,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit solution.");
        return;
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Editor */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <label
            htmlFor="language"
            className="text-sm font-semibold text-slate-700"
          >
            Language
          </label>

          <select
            id="language"
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setSubmitted(false);
              setError("");
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="Java">Java</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="C++">C++</option>
          </select>
        </div>

        <textarea
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setSubmitted(false);
            setError("");
          }}
          spellCheck={false}
          className="min-h-105 w-full resize-none bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100 outline-none"
          placeholder="Write your solution here..."
        />

        <div className="flex items-center justify-between border-t border-slate-200 p-4">
          <p className="text-xs text-slate-500">{code.length} characters</p>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!code.trim() || loading}
            className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Solution"}
          </button>
        </div>
      </section>

      {/* Success */}
      {submitted && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="font-semibold text-emerald-800">
            Solution submitted successfully.
          </p>

          <p className="mt-1 text-sm text-emerald-700">
            Your submission has been saved.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-800">{error}</p>
        </div>
      )}
    </>
  );
}
