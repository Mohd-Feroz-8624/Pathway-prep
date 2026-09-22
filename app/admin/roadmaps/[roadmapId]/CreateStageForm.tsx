"use client";

import { FormEvent, useState } from "react";

type Props = {
  roadmapId: string;
};

export default function CreateStageForm({ roadmapId }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/roadmaps/${roadmapId}/stages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create stage.");
      }

      setTitle("");
      setDescription("");

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create stage.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="stage-title"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Stage Title
        </label>

        <input
          id="stage-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. HTML & CSS Fundamentals"
          required
          maxLength={150}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="stage-description"
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Description
        </label>

        <textarea
          id="stage-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What will students learn in this stage?"
          rows={5}
          maxLength={1000}
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Adding..." : "Add Stage"}
      </button>
    </form>
  );
}
