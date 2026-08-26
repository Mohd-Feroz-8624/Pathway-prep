"use client";

import { useState } from "react";

type Education = {
  id: string;
  institution: string;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
};

type ResumeEducationProps = {
  resumeId: string;
  education: Education[];
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
  const [entries, setEntries] = useState<Education[]>(education);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<EducationForm>(emptyForm);

  const [isAddingEducation, setIsAddingEducation] = useState(false);
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
  }

  async function handleAdd() {
    if (!form.institution.trim()) {
      return;
    }

    setIsAddingEducation(true);
    setError("");

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

      setEntries((current) => [...current, data.data]);

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

      setEntries((current) => current.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Delete education error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  }

  function handleEdit(entry: Education) {
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
    if (!editingId || !form.institution.trim()) {
      return;
    }

    setIsUpdating(true);
    setError("");

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

      setEntries((current) =>
        current.map((entry) => (entry.id === editingId ? data.data : entry)),
      );

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
      <div className="flex flex-col gap-4 mt-4  sm:flex-row sm:items-start sm:justify-between">
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
          }}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {isAdding ? "Cancel" : "+ Add Education"}
        </button>
      </div>

      {/* Add Education Form */}
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
                htmlFor={`start-date-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Start Date
              </label>

              <input
                id={`start-date-${resumeId}`}
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
                htmlFor={`end-date-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                End Date
              </label>

              <input
                id={`end-date-${resumeId}`}
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
                htmlFor={`description-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id={`description-${resumeId}`}
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Relevant coursework, achievements, CGPA, etc."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-5  flex justify-end">
            <button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={
                !form.institution.trim() || isAddingEducation || isUpdating
              }
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              {isUpdating
                ? "Updating..."
                : isAddingEducation
                  ? "Adding..."
                  : editingId
                    ? "Update Education"
                    : "Add Education"}
                    
            </button>
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
