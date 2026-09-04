"use client";

import { FormEvent, useState } from "react";

type Props = {
  roadmapId: string;
  initialTitle: string;
  initialSlug: string;
  initialDescription: string | null;
  initialCategory: string | null;
  initialDuration: string | null;
  onCancel: () => void;
};

export default function EditRoadmapForm({
  roadmapId,
  initialTitle,
  initialSlug,
  initialDescription,
  initialCategory,
  initialDuration,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [duration, setDuration] = useState(initialDuration ?? "");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Roadmap title is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Roadmap slug is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/roadmaps/${roadmapId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          category,
          duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update roadmap.");
      }

      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update roadmap.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <h3 className="text-base font-bold text-slate-950">Edit Roadmap</h3>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="roadmap-title"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Title
          </label>

          <input
            id="roadmap-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={150}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="roadmap-slug"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Slug
          </label>

          <input
            id="roadmap-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            maxLength={150}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="roadmap-description"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Description
          </label>

          <textarea
            id="roadmap-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={1000}
            className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="roadmap-category"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Category
            </label>

            <input
              id="roadmap-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              maxLength={100}
              placeholder="e.g. Development"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="roadmap-duration"
              className="mb-2 block text-sm font-semibold text-slate-900"
            >
              Duration
            </label>

            <input
              id="roadmap-duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              maxLength={100}
              placeholder="e.g. 6 months"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
