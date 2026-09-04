"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type EditSubjectFormProps = {
  subjectId: string;
  initialName: string;
  initialCode: string | null;
  onCancel: () => void;
};

export default function EditSubjectForm({
  subjectId,
  initialName,
  initialCode,
  onCancel,
}: EditSubjectFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [code, setCode] = useState(initialCode ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Subject name is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/academics/subjects/${subjectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            code: code.trim() || null,
          }),
        },
      );

      const responseText = await response.text();

      let data: { error?: string };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Subject update API returned non-JSON:",
          response.status,
          responseText,
        );

        throw new Error(
          `Server returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to update subject.");
      }

      router.refresh();
      onCancel();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update subject.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label
          htmlFor={`subject-name-${subjectId}`}
          className="block text-sm font-semibold text-slate-700"
        >
          Subject Name
        </label>

        <input
          id={`subject-name-${subjectId}`}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor={`subject-code-${subjectId}`}
          className="block text-sm font-semibold text-slate-700"
        >
          Subject Code
        </label>

        <input
          id={`subject-code-${subjectId}`}
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          disabled={loading}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
