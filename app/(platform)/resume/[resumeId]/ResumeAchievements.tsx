"use client";

import { useState } from "react";

type Achievement = {
  id: string;
  title: string;
  description: string | null;
};

type ResumeAchievementsProps = {
  resumeId: string;
  achievements: Achievement[];
};

type AchievementForm = {
  title: string;
  description: string;
};

const emptyForm: AchievementForm = {
  title: "",
  description: "",
};

export default function ResumeAchievements({
  resumeId,
  achievements,
}: ResumeAchievementsProps) {
  const [entries, setEntries] = useState<Achievement[]>(achievements);

  const [isAdding, setIsAdding] = useState(false);
  const [isAddingAchievement, setIsAddingAchievement] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<AchievementForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }
  async function handleAdd() {
    if (!form.title.trim()) {
      return;
    }

    setIsAddingAchievement(true);
    setError("");

    try {
      const response = await fetch(`/api/resumes/${resumeId}/achievements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add achievement.");
        return;
      }

      setEntries((current) => [...current, data.data]);

      setForm(emptyForm);
      setIsAdding(false);
    } catch (error) {
      console.error("Add achievement error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsAddingAchievement(false);
    }
  }
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this achievement?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(id);
    setError("");

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/achievements/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete achievement.");
        return;
      }

      setEntries((current) => current.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Delete achievement error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  }
  function handleEdit(achievement: Achievement) {
    setEditingId(achievement.id);

    setForm({
      title: achievement.title,
      description: achievement.description ?? "",
    });

    setIsAdding(true);
    setError("");
  }
  async function handleUpdate() {
    if (!editingId || !form.title.trim()) {
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/achievements/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update achievement.");
        return;
      }

      setEntries((current) =>
        current.map((entry) => (entry.id === editingId ? data.data : entry)),
      );

      setForm(emptyForm);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Update achievement error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Achievements</h3>

          <p className="mt-1 text-sm text-slate-500">
            Highlight awards, accomplishments, and notable achievements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAdding((current) => !current);

            if (editingId) {
              setEditingId(null);
              setForm(emptyForm);
              setError("");
            }
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {isAdding ? "Cancel" : "+ Add Achievement"}
        </button>
      </div>

      {/* Add Achievement Form */}
      {isAdding && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor={`achievement-title-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Achievement *
              </label>

              <input
                id={`achievement-title-${resumeId}`}
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Winner of Smart India Hackathon"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor={`achievement-description-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id={`achievement-description-${resumeId}`}
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Briefly describe the achievement and your contribution..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={!form.title.trim() || isAddingAchievement || isUpdating}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {error && (
                <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
              )}
              {isUpdating
                ? "Updating..."
                : isAddingAchievement
                  ? "Adding..."
                  : editingId
                    ? "Update Achievement"
                    : "Add Achievement"}
            </button>
          </div>
        </div>
      )}

      {/* Achievement Entries */}
      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h4 className="font-semibold text-slate-950">
              No achievements added yet
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Add achievements that strengthen your resume.
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-slate-950">
                    {entry.title}
                  </h4>

                  {entry.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {entry.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 self-start">
                  <button
                    type="button"
                    onClick={() => handleEdit(entry)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    disabled={isDeleting === entry.id}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting === entry.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
