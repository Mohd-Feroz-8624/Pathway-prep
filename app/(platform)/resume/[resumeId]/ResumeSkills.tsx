"use client";

import { useState } from "react";
import { useResumeEditor } from "./ResumeEditorShell";

import type { ResumeSkill as PrismaResumeSkill } from "@/app/generated/prisma/client";

type ResumeSkillsProps = {
  resumeId: string;
  skills: PrismaResumeSkill[];
};

type SkillForm = {
  name: string;
  category: string;
};

const emptyForm: SkillForm = {
  name: "",
  category: "",
};

export default function ResumeSkills({ resumeId, skills }: ResumeSkillsProps) {
  const { updateResumeData } = useResumeEditor();

  const [entries, setEntries] = useState<PrismaResumeSkill[]>(skills);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<SkillForm>(emptyForm);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  async function handleAdd() {
    setError("");

    if (!form.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    setIsAddingSkill(true);

    try {
      const response = await fetch(`/api/resumes/${resumeId}/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add skill.");
        return;
      }

      const updatedEntries: PrismaResumeSkill[] = [...entries, data.data];

      setEntries(updatedEntries);

      updateResumeData({
        skills: updatedEntries,
      });

      setForm(emptyForm);
      setIsAdding(false);
    } catch (error) {
      console.error("Add skill error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAddingSkill(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(id);
    setError("");

    try {
      const response = await fetch(`/api/resumes/${resumeId}/skills/${id}`, {
        method: "DELETE",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Expected JSON but received:", text);

        setError(`Server returned ${response.status} instead of JSON.`);

        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete skill.");
        return;
      }

      const updatedEntries = entries.filter((entry) => entry.id !== id);

      setEntries(updatedEntries);

      updateResumeData({
        skills: updatedEntries,
      });
    } catch (error) {
      console.error("Delete skill error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  }

  function handleEdit(skill: PrismaResumeSkill) {
    setEditingId(skill.id);

    setForm({
      name: skill.name,
      category: skill.category ?? "",
    });

    setIsAdding(true);
    setError("");
  }

  async function handleUpdate() {
    setError("");

    if (!editingId) {
      setError("Skill could not be identified.");
      return;
    }

    if (!form.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/skills/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            category: form.category,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update skill.");
        return;
      }

      const updatedEntries = entries.map((entry) =>
        entry.id === editingId ? (data.data as PrismaResumeSkill) : entry,
      );

      setEntries(updatedEntries);

      updateResumeData({
        skills: updatedEntries,
      });

      setForm(emptyForm);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Update skill error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <section>
      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Skills</h3>

          <p className="mt-1 text-sm text-slate-500">
            Add technical skills and organize them by category.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAdding((current) => !current);

            if (editingId) {
              setEditingId(null);
              setForm(emptyForm);
            }

            setError("");
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {isAdding ? "Cancel" : "+ Add Skill"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}

      {/* Add / Edit Skill Form */}
      {isAdding && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Skill Name */}
            <div>
              <label
                htmlFor={`skill-name-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Skill *
              </label>

              <input
                id={`skill-name-${resumeId}`}
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="JavaScript"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor={`skill-category-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <input
                id={`skill-category-${resumeId}`}
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                placeholder="Frontend"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-5 flex flex-col items-end">
            <button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={isAddingSkill || isUpdating}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : isAddingSkill
                  ? "Adding..."
                  : editingId
                    ? "Update Skill"
                    : "Add Skill"}
            </button>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="mt-6">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h4 className="font-semibold text-slate-950">
              No skills added yet
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Add skills that represent your technical expertise.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(
              entries.reduce<Record<string, PrismaResumeSkill[]>>(
                (groups, skill) => {
                  const category = skill.category || "Other";

                  if (!groups[category]) {
                    groups[category] = [];
                  }

                  groups[category].push(skill);

                  return groups;
                },
                {},
              ),
            ).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="mb-3 text-sm font-bold text-slate-800">
                  {category}
                </h4>

                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {skill.name}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(skill)}
                          aria-label={`Edit ${skill.name}`}
                          className="text-xs font-semibold text-blue-500 transition hover:text-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(skill.id)}
                          disabled={isDeleting === skill.id}
                          aria-label={`Delete ${skill.name}`}
                          className="text-sm font-bold text-slate-400 transition hover:text-red-600 disabled:opacity-50"
                        >
                          {isDeleting === skill.id ? "..." : "×"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
