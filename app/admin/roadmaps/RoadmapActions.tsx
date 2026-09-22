"use client";

import { useState } from "react";
import EditRoadmapForm from "./EditRoadmapForm";
import { useRouter } from "next/navigation";

type RoadmapActionsProps = {
  roadmapId: string;
  initialTitle: string;
  initialSlug: string;
  initialDescription: string | null;
  initialCategory: string | null;
  initialDuration: string | null;
  initialPublished: boolean;
};

export default function RoadmapActions({
  roadmapId,
  initialTitle,
  initialSlug,
  initialDescription,
  initialCategory,
  initialDuration,
  initialPublished,
}: RoadmapActionsProps) {
  const [editing, setEditing] = useState(false);
  const [published, setPublished] = useState(initialPublished);
  const [updatingPublish, setUpdatingPublish] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handlePublishToggle() {
    setUpdatingPublish(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/roadmaps/${roadmapId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update publication status.");
      }

      setPublished(!published);
      window.location.reload();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update publication status.",
      );
    } finally {
      setUpdatingPublish(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this roadmap? All stages, tasks, and related progress records will also be deleted.",
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/roadmaps/${roadmapId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete roadmap.");
      }

      router.push("/admin/roadmaps");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete roadmap.",
      );
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <EditRoadmapForm
        roadmapId={roadmapId}
        initialTitle={initialTitle}
        initialSlug={initialSlug}
        initialDescription={initialDescription}
        initialCategory={initialCategory}
        initialDuration={initialDuration}
        onCancel={() => {
          setEditing(false);
          setError("");
        }}
      />
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setEditing(true);
            setError("");
          }}
          disabled={updatingPublish || deleting}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Edit Roadmap
        </button>

        <button
          type="button"
          onClick={handlePublishToggle}
          disabled={updatingPublish || deleting}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            published
              ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {updatingPublish
            ? "Updating..."
            : published
              ? "Unpublish"
              : "Publish"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={updatingPublish || deleting}
          className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete Roadmap"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
