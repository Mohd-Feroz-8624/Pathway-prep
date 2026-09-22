"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CreateSubjectFormProps = {
  semesterId: string;
};

export default function CreateSubjectForm({
  semesterId,
}: CreateSubjectFormProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
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
      const response = await fetch("/api/admin/academics/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semesterId,
          name: name.trim(),
          code: code.trim() || null,
        }),
      });

     const responseText = await response.text();

     let data: { error?: string };

     try {
       data = JSON.parse(responseText);
     } catch {
       console.error("Subject API returned non-JSON:", responseText);

       throw new Error(
         `Server returned an invalid response (${response.status}).`,
       );
     }

     if (!response.ok) {
       throw new Error(data.error || "Failed to create subject.");
     }

      setName("");
      setCode("");
      setOpen(false);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create subject.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          setError("");
        }}
        className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {open ? "Cancel" : "+ Add Subject"}
      </button>

      {open && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Add Subject</h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a new subject for this semester.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="subject-name"
                className="block text-sm font-semibold text-slate-700"
              >
                Subject Name
              </label>

              <input
                id="subject-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Computer Networks"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="subject-code"
                className="block text-sm font-semibold text-slate-700"
              >
                Subject Code
              </label>

              <input
                id="subject-code"
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g. CS601"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Subject"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
