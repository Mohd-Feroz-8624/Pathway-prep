"use client";

import { useState } from "react";
import { useResumeEditor } from "./ResumeEditorShell";

import type { ResumeExperience as PrismaResumeExperience } from "@/app/generated/prisma/client";

type ResumeExperienceProps = {
  resumeId: string;
  experience: PrismaResumeExperience[];
};

type ExperienceForm = {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
};

const emptyForm: ExperienceForm = {
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

export default function ResumeExperience({
  resumeId,
  experience,
}: ResumeExperienceProps) {
  const { updateResumeData } = useResumeEditor();

  const [entries, setEntries] = useState<PrismaResumeExperience[]>(experience);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);

  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    const { name, value, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));

    setError("");
  }

  async function handleAdd() {
    setError("");

    if (!form.position.trim()) {
      setError("Position is required.");
      return;
    }

    if (!form.company.trim()) {
      setError("Company is required.");
      return;
    }

    setIsAddingExperience(true);

    try {
      const response = await fetch(`/api/resumes/${resumeId}/experience`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: form.company,
          position: form.position,
          location: form.location,
          startDate: form.startDate,
          endDate: form.endDate,
          isCurrent: form.isCurrent,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add experience.");
        return;
      }

      const updatedEntries: PrismaResumeExperience[] = [...entries, data.data];

      setEntries(updatedEntries);

      updateResumeData({
        experience: updatedEntries,
      });

      setForm(emptyForm);
      setIsAdding(false);
    } catch (error) {
      console.error("Add experience error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAddingExperience(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience entry?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(id);
    setError("");

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/experience/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete experience.");
        return;
      }

      const updatedEntries = entries.filter((entry) => entry.id !== id);

      setEntries(updatedEntries);

      updateResumeData({
        experience: updatedEntries,
      });
    } catch (error) {
      console.error("Delete experience error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  }

  function handleEdit(entry: PrismaResumeExperience) {
    setEditingId(entry.id);

    setForm({
      company: entry.company,
      position: entry.position,
      location: entry.location ?? "",
      startDate: entry.startDate ?? "",
      endDate: entry.endDate ?? "",
      isCurrent: entry.isCurrent,
      description: entry.description ?? "",
    });

    setIsAdding(true);
    setError("");
  }

  async function handleUpdate() {
    setError("");

    if (!editingId) {
      setError("Experience entry could not be identified.");
      return;
    }

    if (!form.position.trim()) {
      setError("Position is required.");
      return;
    }

    if (!form.company.trim()) {
      setError("Company is required.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/experience/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company: form.company,
            position: form.position,
            location: form.location,
            startDate: form.startDate,
            endDate: form.endDate,
            isCurrent: form.isCurrent,
            description: form.description,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update experience.");
        return;
      }

      const updatedEntries = entries.map((entry) =>
        entry.id === editingId ? (data.data as PrismaResumeExperience) : entry,
      );

      setEntries(updatedEntries);

      updateResumeData({
        experience: updatedEntries,
      });

      setForm(emptyForm);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Update experience error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <section>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Experience</h3>

          <p className="mt-1 text-sm text-slate-500">
            Add internships, jobs, freelance work, and other professional
            experience.
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
          {isAdding ? "Cancel" : "+ Add Experience"}
        </button>
      </div>

      {/* Add / Edit Experience Form */}
      {isAdding && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`position-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Position *
              </label>

              <input
                id={`position-${resumeId}`}
                name="position"
                type="text"
                value={form.position}
                onChange={handleChange}
                placeholder="Software Engineering Intern"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`company-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Company *
              </label>

              <input
                id={`company-${resumeId}`}
                name="company"
                type="text"
                value={form.company}
                onChange={handleChange}
                placeholder="Company Name"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`experience-location-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Location
              </label>

              <input
                id={`experience-location-${resumeId}`}
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="Hyderabad, India"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`experience-start-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Start Date
              </label>

              <input
                id={`experience-start-${resumeId}`}
                name="startDate"
                type="text"
                value={form.startDate}
                onChange={handleChange}
                placeholder="Jun 2025"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`experience-end-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                End Date
              </label>

              <input
                id={`experience-end-${resumeId}`}
                name="endDate"
                type="text"
                value={form.endDate}
                onChange={handleChange}
                disabled={form.isCurrent}
                placeholder="Aug 2025"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div className="flex items-center gap-3 sm:pt-7">
              <input
                id={`current-${resumeId}`}
                name="isCurrent"
                type="checkbox"
                checked={form.isCurrent}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300"
              />

              <label
                htmlFor={`current-${resumeId}`}
                className="text-sm font-medium text-slate-700"
              >
                I currently work here
              </label>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`experience-description-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id={`experience-description-${resumeId}`}
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your responsibilities, contributions, and achievements..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col items-end">
            <button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={isAddingExperience || isUpdating}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : isAddingExperience
                  ? "Adding..."
                  : editingId
                    ? "Update Experience"
                    : "Add Experience"}
            </button>

            {error && (
              <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>
        </div>
      )}

      {/* Experience Entries */}
      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h4 className="font-semibold text-slate-950">
              No experience added yet
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Add internships, jobs, or other professional experience.
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-950">
                    {entry.position}
                  </h4>

                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {entry.company}
                    {entry.location ? ` • ${entry.location}` : ""}
                  </p>

                  {(entry.startDate || entry.endDate || entry.isCurrent) && (
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {entry.startDate ?? ""}
                      {" — "}
                      {entry.isCurrent ? "Present" : (entry.endDate ?? "")}
                    </p>
                  )}

                  {entry.description && (
                    <p className="mt-3 text-sm leading-6 text-slate-500">
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
