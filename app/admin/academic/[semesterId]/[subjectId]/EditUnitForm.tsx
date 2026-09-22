"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type EditUnitFormProps = {
  unitId: string;
  initialNumber: number;
  initialTitle: string;
  initialDescription: string | null;
  initialDifficulty: string | null;
  initialDuration: string | null;
  onCancel: () => void;
};

export default function EditUnitForm({
  unitId,
  initialNumber,
  initialTitle,
  initialDescription,
  initialDifficulty,
  initialDuration,
  onCancel,
}: EditUnitFormProps) {
  const router = useRouter();

  const [number, setNumber] = useState(String(initialNumber));
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [difficulty, setDifficulty] = useState(initialDifficulty ?? "");
  const [duration, setDuration] = useState(initialDuration ?? "");

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
      const response = await fetch(`/api/admin/academics/units/${unitId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: unitNumber,
          title: title.trim(),
          description: description.trim() || null,
          difficulty: difficulty.trim() || null,
          duration: duration.trim() || null,
        }),
      });

      const responseText = await response.text();

      let data: { error?: string };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Unit update API returned non-JSON:",
          response.status,
          responseText,
        );

        throw new Error(
          `Server returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to update unit.");
      }

      router.refresh();
      onCancel();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update unit.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div>
        <label
          htmlFor={`unit-number-${unitId}`}
          className="block text-sm font-semibold text-slate-700"
        >
          Unit Number
        </label>

        <input
          id={`unit-number-${unitId}`}
          type="number"
          min="1"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          disabled={loading}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor={`unit-title-${unitId}`}
          className="block text-sm font-semibold text-slate-700"
        >
          Unit Title
        </label>

        <input
          id={`unit-title-${unitId}`}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={loading}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor={`unit-description-${unitId}`}
          className="block text-sm font-semibold text-slate-700"
        >
          Description
        </label>

        <textarea
          id={`unit-description-${unitId}`}
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={loading}
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`unit-difficulty-${unitId}`}
            className="block text-sm font-semibold text-slate-700"
          >
            Difficulty
          </label>

          <input
            id={`unit-difficulty-${unitId}`}
            type="text"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            placeholder="e.g. Beginner"
            disabled={loading}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor={`unit-duration-${unitId}`}
            className="block text-sm font-semibold text-slate-700"
          >
            Duration
          </label>

          <input
            id={`unit-duration-${unitId}`}
            type="text"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            placeholder="e.g. 2 weeks"
            disabled={loading}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
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
