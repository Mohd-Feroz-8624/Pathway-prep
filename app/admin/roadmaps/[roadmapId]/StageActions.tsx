"use client";

import { useState } from "react";

type StageActionsProps = {
  roadmapId: string;
  stageId: string;
  initialTitle: string;
  initialDescription: string | null;
};

export default function StageActions({
  roadmapId,
  stageId,
  initialTitle,
  initialDescription,
}: StageActionsProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate() {
    if (!title.trim()) {
      setError("Stage title is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/roadmaps/${roadmapId}/stages/${stageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update stage.");
      }

      setEditing(false);
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update stage.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this stage? Any tasks inside this stage may also be deleted.",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/roadmaps/${roadmapId}/stages/${stageId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete stage.");
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete stage.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="space-y-4">
          <div>
            <label
              htmlFor={`edit-title-${stageId}`}
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Stage Title
            </label>

            <input
              id={`edit-title-${stageId}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor={`edit-description-${stageId}`}
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Description
            </label>

            <textarea
              id={`edit-description-${stageId}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

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
              }}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
