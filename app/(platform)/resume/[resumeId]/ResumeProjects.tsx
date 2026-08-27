"use client";

import { useState } from "react";
import { useResumeEditor } from "./ResumeEditorShell";

import type { ResumeProject as PrismaResumeProject } from "@/app/generated/prisma/client";

type ResumeProjectsProps = {
  resumeId: string;
  projects: PrismaResumeProject[];
};

type ProjectForm = {
  title: string;
  description: string;
  technologies: string;
  githubUrl: string;
  liveUrl: string;
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
};

export default function ResumeProjects({
  resumeId,
  projects,
}: ResumeProjectsProps) {
  const { updateResumeData } = useResumeEditor();

  const [entries, setEntries] = useState<PrismaResumeProject[]>(projects);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  async function handleAdd() {
    setError("");

    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }

    setIsAddingProject(true);

    try {
      const response = await fetch(`/api/resumes/${resumeId}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          technologies: form.technologies,
          githubUrl: form.githubUrl,
          liveUrl: form.liveUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add project.");
        return;
      }

      const updatedEntries: PrismaResumeProject[] = [...entries, data.data];

      setEntries(updatedEntries);

      updateResumeData({
        projects: updatedEntries,
      });

      setForm(emptyForm);
      setIsAdding(false);
    } catch (error) {
      console.error("Add project error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAddingProject(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(id);
    setError("");

    try {
      const response = await fetch(`/api/resumes/${resumeId}/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete project.");
        return;
      }

      const updatedEntries = entries.filter((entry) => entry.id !== id);

      setEntries(updatedEntries);

      updateResumeData({
        projects: updatedEntries,
      });
    } catch (error) {
      console.error("Delete project error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  }

  function handleEdit(entry: PrismaResumeProject) {
    setEditingId(entry.id);

    setForm({
      title: entry.title,
      description: entry.description ?? "",
      technologies: entry.technologies ?? "",
      githubUrl: entry.githubUrl ?? "",
      liveUrl: entry.liveUrl ?? "",
    });

    setIsAdding(true);
    setError("");
  }

  async function handleUpdate() {
    setError("");

    if (!editingId) {
      setError("Project could not be identified.");
      return;
    }

    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/projects/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            technologies: form.technologies,
            githubUrl: form.githubUrl,
            liveUrl: form.liveUrl,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update project.");
        return;
      }

      const updatedEntries = entries.map((entry) =>
        entry.id === editingId ? (data.data as PrismaResumeProject) : entry,
      );

      setEntries(updatedEntries);

      updateResumeData({
        projects: updatedEntries,
      });

      setForm(emptyForm);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Update project error:", error);
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
          <h3 className="text-lg font-bold text-slate-950">Projects</h3>

          <p className="mt-1 text-sm text-slate-500">
            Showcase projects that demonstrate your technical skills and
            practical experience.
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
          {isAdding ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
      )}

      {/* Add / Edit Project Form */}
      {isAdding && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Project Title */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`project-title-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Project Title *
              </label>

              <input
                id={`project-title-${resumeId}`}
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                placeholder="Pathway Prep"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Technologies */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`technologies-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Technologies
              </label>

              <input
                id={`technologies-${resumeId}`}
                name="technologies"
                type="text"
                value={form.technologies}
                onChange={handleChange}
                placeholder="Next.js, TypeScript, Prisma, PostgreSQL"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-slate-400">
                Separate technologies with commas.
              </p>
            </div>

            {/* Live URL */}
            <div>
              <label
                htmlFor={`live-url-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Live URL
              </label>

              <input
                id={`live-url-${resumeId}`}
                name="liveUrl"
                type="url"
                value={form.liveUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label
                htmlFor={`github-url-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                GitHub URL
              </label>

              <input
                id={`github-url-${resumeId}`}
                name="githubUrl"
                type="url"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/project"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label
                htmlFor={`project-description-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id={`project-description-${resumeId}`}
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the project, your contribution, and key achievements..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-5 flex flex-col items-end">
            <button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={isAddingProject || isUpdating}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : isAddingProject
                  ? "Adding..."
                  : editingId
                    ? "Update Project"
                    : "Add Project"}
            </button>
          </div>
        </div>
      )}

      {/* Project Entries */}
      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h4 className="font-semibold text-slate-950">
              No projects added yet
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Add projects that demonstrate your skills.
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

                  {/* Technologies */}
                  {entry.technologies && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.technologies
                        .split(",")
                        .map((technology) => technology.trim())
                        .filter(Boolean)
                        .map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          >
                            {technology}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Description */}
                  {entry.description && (
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {entry.description}
                    </p>
                  )}

                  {/* Links */}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    {entry.liveUrl && (
                      <a
                        href={entry.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Live Demo ↗
                      </a>
                    )}

                    {entry.githubUrl && (
                      <a
                        href={entry.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-700 hover:underline"
                      >
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
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
