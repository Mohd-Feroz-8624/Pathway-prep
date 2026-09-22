"use client";

import { FormEvent, useState } from "react";

type TaskFormProps = {
  roadmapId: string;
  stageId: string;
};

export default function TaskForm({ roadmapId, stageId }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [required, setRequired] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/roadmaps/${roadmapId}/stages/${stageId}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            resourceUrl,
            required,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task.");
      }

      setTitle("");
      setDescription("");
      setResourceUrl("");
      setRequired(true);
      setOpen(false);

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create task.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        + Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label
          htmlFor={`task-title-${stageId}`}
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Task Title
        </label>

        <input
          id={`task-title-${stageId}`}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Learn HTML Fundamentals"
          required
          maxLength={200}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor={`task-description-${stageId}`}
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Description
        </label>

        <textarea
          id={`task-description-${stageId}`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What should the student learn or complete?"
          rows={4}
          maxLength={1500}
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor={`task-resource-${stageId}`}
          className="mb-2 block text-sm font-semibold text-slate-900"
        >
          Resource URL
          <span className="ml-1 font-normal text-slate-400">(optional)</span>
        </label>

        <input
          id={`task-resource-${stageId}`}
          type="url"
          value={resourceUrl}
          onChange={(event) => setResourceUrl(event.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <input
          type="checkbox"
          checked={required}
          onChange={(event) => setRequired(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />

        <span>
          <span className="block text-sm font-semibold text-slate-900">
            Required task
          </span>

          <span className="block text-xs text-slate-500">
            Include this task in roadmap completion progress.
          </span>
        </span>
      </label>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Adding..." : "Add Task"}
        </button>

        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError("");
          }}
          disabled={submitting}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
