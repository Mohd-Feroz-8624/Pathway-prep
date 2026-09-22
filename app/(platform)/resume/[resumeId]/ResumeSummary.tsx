"use client";

import { useState } from "react";
import { useResumeEditor } from "./ResumeEditorShell";

type ResumeSummaryProps = {
  resumeId: string;
  summary: string;
};

export default function ResumeSummary({
  resumeId,
  summary,
}: ResumeSummaryProps) {
  const [value, setValue] = useState(summary);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { updateResumeData } = useResumeEditor();

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
    setIsDirty(true);
    setSuccess("");
    setError("");
  }

  async function handleSave() {
    if (!isDirty) {
      return;
    }

    setSuccess("");
    setError("");

    if (!value.trim()) {
      setError("Please enter a professional summary.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to save summary.");
        return;
      }
      updateResumeData({ summary: value });

      setIsDirty(false);
      setSuccess("Professional summary saved successfully.");
    } catch (error) {
      console.error("Save summary error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-950">
          Professional Summary
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Write a concise summary highlighting your skills, experience, and
          career goals.
        </p>
      </div>

      <textarea
        value={value}
        onChange={handleChange}
        rows={6}
        placeholder="Example: Computer Science student with experience in full-stack development..."
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {success && (
            <p className="text-sm font-medium text-emerald-600">{success}</p>
          )}

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Summary"}
        </button>
      </div>
    </div>
  );
}
