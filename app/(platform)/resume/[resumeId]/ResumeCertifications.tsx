"use client";

import { useState } from "react";
import { useResumeEditor } from "./ResumeEditorShell";

import type { ResumeCertification as PrismaResumeCertification } from "@/app/generated/prisma/client";

type ResumeCertificationsProps = {
  resumeId: string;
  certifications: PrismaResumeCertification[];
};

type CertificationForm = {
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
};

const emptyForm: CertificationForm = {
  name: "",
  issuer: "",
  issueDate: "",
  credentialUrl: "",
};

export default function ResumeCertifications({
  resumeId,
  certifications,
}: ResumeCertificationsProps) {
  const { updateResumeData } = useResumeEditor();

  const [entries, setEntries] =
    useState<PrismaResumeCertification[]>(certifications);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<CertificationForm>(emptyForm);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

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
      setError("Certification name is required.");
      return;
    }

    setIsAddingCertification(true);

    try {
      const response = await fetch(`/api/resumes/${resumeId}/certifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          issuer: form.issuer,
          issueDate: form.issueDate,
          credentialUrl: form.credentialUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add certification.");
        return;
      }

      const updatedEntries: PrismaResumeCertification[] = [
        ...entries,
        data.data,
      ];

      setEntries(updatedEntries);

      updateResumeData({
        certifications: updatedEntries,
      });

      setForm(emptyForm);
      setIsAdding(false);
    } catch (error) {
      console.error("Add certification error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsAddingCertification(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this certification?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(id);
    setError("");

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/certifications/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete certification.");
        return;
      }

      const updatedEntries = entries.filter((entry) => entry.id !== id);

      setEntries(updatedEntries);

      updateResumeData({
        certifications: updatedEntries,
      });
    } catch (error) {
      console.error("Delete certification error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  }

  function handleEdit(certification: PrismaResumeCertification) {
    setEditingId(certification.id);

    setForm({
      name: certification.name,
      issuer: certification.issuer ?? "",
      issueDate: certification.issueDate ?? "",
      credentialUrl: certification.credentialUrl ?? "",
    });

    setIsAdding(true);
    setError("");
  }

  async function handleUpdate() {
    setError("");

    if (!editingId) {
      setError("Certification could not be identified.");
      return;
    }

    if (!form.name.trim()) {
      setError("Certification name is required.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/certifications/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            issuer: form.issuer,
            issueDate: form.issueDate,
            credentialUrl: form.credentialUrl,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update certification.");
        return;
      }

      const updatedEntries = entries.map((entry) =>
        entry.id === editingId
          ? (data.data as PrismaResumeCertification)
          : entry,
      );

      setEntries(updatedEntries);

      updateResumeData({
        certifications: updatedEntries,
      });

      setForm(emptyForm);
      setEditingId(null);
      setIsAdding(false);
    } catch (error) {
      console.error("Update certification error:", error);
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
          <h3 className="text-lg font-bold text-slate-950">Certifications</h3>

          <p className="mt-1 text-sm text-slate-500">
            Add certifications, courses, and professional credentials.
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
          {isAdding ? "Cancel" : "+ Add Certification"}
        </button>
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor={`certification-name-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Certification Name *
              </label>

              <input
                id={`certification-name-${resumeId}`}
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="AWS Certified Cloud Practitioner"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`certification-issuer-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Issuing Organization
              </label>

              <input
                id={`certification-issuer-${resumeId}`}
                name="issuer"
                type="text"
                value={form.issuer}
                onChange={handleChange}
                placeholder="Amazon Web Services"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor={`certification-date-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Issue Date
              </label>

              <input
                id={`certification-date-${resumeId}`}
                name="issueDate"
                type="text"
                value={form.issueDate}
                onChange={handleChange}
                placeholder="August 2026"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`credential-url-${resumeId}`}
                className="text-sm font-semibold text-slate-700"
              >
                Credential URL
              </label>

              <input
                id={`credential-url-${resumeId}`}
                name="credentialUrl"
                type="url"
                value={form.credentialUrl}
                onChange={handleChange}
                placeholder="https://example.com/credential"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col items-end">
            <button
              type="button"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={isAddingCertification || isUpdating}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : isAddingCertification
                  ? "Adding..."
                  : editingId
                    ? "Update Certification"
                    : "Add Certification"}
            </button>

            {error && (
              <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
            )}
          </div>
        </div>
      )}

      {/* Certification Entries */}
      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h4 className="font-semibold text-slate-950">
              No certifications added yet
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              Add certifications and professional credentials.
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
                    {entry.name}
                  </h4>

                  {entry.issuer && (
                    <p className="mt-1 text-sm font-medium text-slate-600">
                      {entry.issuer}
                    </p>
                  )}

                  {entry.issueDate && (
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Issued: {entry.issueDate}
                    </p>
                  )}

                  {entry.credentialUrl && (
                    <div className="mt-4">
                      <a
                        href={entry.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        View Credential ↗
                      </a>
                    </div>
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
