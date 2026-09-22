"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import EditSubjectForm from "./EditSubjectForm";

type SubjectCardProps = {
  subject: {
    id: string;
    name: string;
    code: string | null;
    slug: string;
    units: {
      id: string;
    }[];
  };
  semesterId: string;
};

export default function SubjectCard({ subject, semesterId }: SubjectCardProps) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${subject.name}"?\n\nThis will also delete all units and resources inside this subject.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleting(true);

    try {
      const response = await fetch(
        `/api/admin/academics/subjects/${subject.id}`,
        {
          method: "DELETE",
        },
      );

      const responseText = await response.text();

      let data: { error?: string };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Subject delete API returned non-JSON:",
          response.status,
          responseText,
        );

        throw new Error(
          `Server returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete subject.");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete subject.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {!editing ? (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Subject
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-950">
                {subject.name}
              </h2>

              {subject.code && (
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {subject.code}
                </p>
              )}

              <p className="mt-3 text-sm text-slate-500">
                {subject.units.length}{" "}
                {subject.units.length === 1 ? "unit" : "units"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setEditing(true);
                }}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <a
            href={`/admin/academic/${semesterId}/${subject.id}`}
            className="mt-5 block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Manage Subject
          </a>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold text-slate-950">Edit Subject</h2>

          <EditSubjectForm
            subjectId={subject.id}
            initialName={subject.name}
            initialCode={subject.code}
            onCancel={() => setEditing(false)}
          />
        </>
      )}
    </article>
  );
}
