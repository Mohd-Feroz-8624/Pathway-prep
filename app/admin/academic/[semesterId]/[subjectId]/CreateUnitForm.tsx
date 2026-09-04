"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CreateUnitFormProps = {
  semesterId: string;
  subjectId: string;
};

export default function CreateUnitForm({
  semesterId,
  subjectId,
}: CreateUnitFormProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const unitNumber = Number(number);

    if (!number || !Number.isInteger(unitNumber) || unitNumber <= 0) {
      setError("Enter a valid unit number.");
      return;
    }

    if (!title.trim()) {
      setError("Unit title is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/academics/units", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semesterId,
          subjectId,
          number: unitNumber,
          title: title.trim(),
          description: description.trim() || null,
        }),
      });

      const responseText = await response.text();

      let data: { error?: string };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Unit API returned non-JSON:",
          response.status,
          responseText,
        );

        throw new Error(
          `Server returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to create unit.");
      }

      setNumber("");
      setTitle("");
      setDescription("");
      setOpen(false);

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create unit.",
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
        {open ? "Cancel" : "+ Add Unit"}
      </button>

      {open && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Add Unit</h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a new unit for this subject.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="unit-number"
                className="block text-sm font-semibold text-slate-700"
              >
                Unit Number
              </label>

              <input
                id="unit-number"
                type="number"
                min="1"
                value={number}
                onChange={(event) => setNumber(event.target.value)}
                placeholder="e.g. 1"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="unit-title"
                className="block text-sm font-semibold text-slate-700"
              >
                Unit Title
              </label>

              <input
                id="unit-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Introduction to Computer Networks"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="unit-description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="unit-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional unit description"
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              {loading ? "Creating..." : "Create Unit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
