"use client";

import { useState } from "react";
import { useResumeEditor } from "./ResumeEditorShell";

import type { ResumeEducation as PrismaResumeEducation } from "@/app/generated/prisma/client";

type ResumeEducationProps = {
  resumeId: string;
  education: PrismaResumeEducation[];
};

type EducationForm = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

const emptyForm: EducationForm = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function ResumeEducation({
  resumeId,
  education,
}: ResumeEducationProps) {
  const { updateResumeData } = useResumeEditor();

  const [entries, setEntries] = useState<PrismaResumeEducation[]>(education);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<EducationForm>(emptyForm);

  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

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

    if (!form.institution.trim()) {
      setError("Institution is required.");
      return;
    }

    setIsAddingEducation(true);

    try {
      const response = await fetch(`/api/resumes/${resumeId}/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          institution: form.institution,
          degree: form.degree,
          field: form.field,
          startDate: form.startDate,
          endDate: form.endDate,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add education.");
        return;
      }

      const updatedEntries: PrismaResumeEducation[] = [...entries, data.data];

      setEntries(updatedEntries);

      updateResumeData({
        education: updatedEntries,
      });

      setForm(emptyForm);
      setIsAdding(false);
    } catch (error) {
      console.error("Add education error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAddingEducation(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education entry?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(id);
    setError("");

    try {
      const response = await fetch(`/api/resumes/${resumeId}/education/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete education.");
        return;
      }

      const updatedEntries = entries.filter((entry) => entry.id !== id);

      setEntries(updatedEntries);

      updateResumeData({
        education: updatedEntries,
      });
    } catch (error) {
      console.error("Delete education error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  }

  function handleEdit(entry: PrismaResumeEducation) {
    setEditingId(entry.id);

    setForm({
      institution: entry.institution,
      degree: entry.degree ?? "",
      field: entry.field ?? "",
      startDate: entry.startDate ?? "",
      endDate: entry.endDate ?? "",
      description: entry.description ?? "",
    });

    setIsAdding(true);
    setError("");
  }

  async function handleUpdate() {
    setError("");

    if (!editingId) {
      setError("Education entry could not be identified.");
      return;
    }

    if (!form.institution.trim()) {
      setError("Institution is required.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/education/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            institution: form.institution,
            degree: form.degree,
            field: form.field,
            startDate: form.startDate,
            endDate: form.endDate,
            description: form.description,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update education.");
        return;
      }

      const updatedEntries = entries.map((entry) =>
        entry.id === editingId ? (data.data as PrismaResumeEducation) : entry,
      );

      setEntries(updatedEntries);

      updateResumeData({
        education: updatedEntries,
      });

      setForm(emptyForm);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Update education error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <section>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Education</h3>

          <p className="mt-1 text-sm text-slate-500">
            Add your academic qualifications and educational background.
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
          {isAdding ? "Cancel" : "+ Add Education"}
        </button>
      </div>

      {/* Add / Edit Education Form */}
      {isAdding && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor={`institution-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Institution *
              </label>

              <input
                id={`institution-${resumeId}`}
                name="institution"
                type="text"
                value={form.institution}
                onChange={handleChange}
                placeholder="Muffakham Jah College of Engineering and Technology"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`degree-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Degree
              </label>

              <input
                id={`degree-${resumeId}`}
                name="degree"
                type="text"
                value={form.degree}
                onChange={handleChange}
                placeholder="B.E."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`field-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Field of Study
              </label>

              <input
                id={`field-${resumeId}`}
                name="field"
                type="text"
                value={form.field}
                onChange={handleChange}
                placeholder="Computer Science and Engineering"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`education-start-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Start Date
              </label>

              <input
                id={`education-start-${resumeId}`}
                name="startDate"
                type="text"
                value={form.startDate}
                onChange={handleChange}
                placeholder="2023"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`education-end-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                End Date
              </label>

              <input
                id={`education-end-${resumeId}`}
                name="endDate"
                type="text"
                value={form.endDate}
                onChange={handleChange}
                placeholder="2027"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`education-description-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id={`education-description-${resumeId}`}
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Relevant coursework, achievements, CGPA, etc."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col items-end">
            <button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={isAddingEducation || isUpdating}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : isAddingEducation
                  ? "Adding..."
                  : editingId
                    ? "Update Education"
                    : "Add Education"}
            </button>

            {error && (
              <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>
        </div>
      )}

      {/* Education Entries */}
      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h4 className="font-semibold text-slate-950">
              No education added yet
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Add your first educational qualification.
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
                    {entry.institution}
                  </h4>

                  {(entry.degree || entry.field) && (
                    <p className="mt-1 text-sm text-slate-600">
                      {[entry.degree, entry.field].filter(Boolean).join(" • ")}
                    </p>
                  )}

                  {(entry.startDate || entry.endDate) && (
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {[entry.startDate, entry.endDate]
                        .filter(Boolean)
                        .join(" — ")}
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
