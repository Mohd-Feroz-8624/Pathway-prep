"use client";

import { useState } from "react";

type TaskActionsProps = {
  roadmapId: string;
  stageId: string;
  taskId: string;
  initialTitle: string;
  initialDescription: string | null;
  initialResourceUrl: string | null;
  initialRequired: boolean;
};

export default function TaskActions({
  roadmapId,
  stageId,
  taskId,
  initialTitle,
  initialDescription,
  initialResourceUrl,
  initialRequired,
}: TaskActionsProps) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [resourceUrl, setResourceUrl] = useState(initialResourceUrl ?? "");
  const [required, setRequired] = useState(initialRequired);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const endpoint = `/api/admin/roadmaps/${roadmapId}/stages/${stageId}/tasks/${taskId}`;

  async function handleUpdate() {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          resourceUrl,
          required,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task.");
      }

      setEditing(false);
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update task.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete task.");
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete task.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <div>
          <label
            htmlFor={`task-edit-title-${taskId}`}
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Task Title
          </label>

          <input
            id={`task-edit-title-${taskId}`}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor={`task-edit-description-${taskId}`}
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Description
          </label>

          <textarea
            id={`task-edit-description-${taskId}`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={1500}
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor={`task-edit-resource-${taskId}`}
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Resource URL
          </label>

          <input
            id={`task-edit-resource-${taskId}`}
            type="url"
            value={resourceUrl}
            onChange={(event) => setResourceUrl(event.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
            type="button"
            onClick={handleUpdate}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError("");
              setTitle(initialTitle);
              setDescription(initialDescription ?? "");
              setResourceUrl(initialResourceUrl ?? "");
              setRequired(initialRequired);
            }}
            disabled={submitting}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          disabled={deleting}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
