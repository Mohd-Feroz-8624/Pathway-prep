"use client";

import { useState } from "react";

const resourceTypes = [
  {
    value: "HANDWRITTEN",
    label: "Handwritten Notes",
    icon: "✍️",
  },
  {
    value: "PDF",
    label: "PDF",
    icon: "📄",
  },
  {
    value: "EXTERNAL",
    label: "External Resource",
    icon: "🌐",
  },
  {
    value: "YOUTUBE",
    label: "YouTube Video",
    icon: "▶️",
  },
];

type AddResourceFormProps = {
  unitId: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function AddResourceForm({
  unitId,
  onCancel,
  onSuccess,
}: AddResourceFormProps) {
  const [type, setType] = useState("HANDWRITTEN");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitId,
          type,
          title,
          description,
          url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create resource.");
        return;
      }

      setTitle("");
      setDescription("");
      setUrl("");
      setType("HANDWRITTEN");

      onSuccess();
    } catch (error) {
      console.error("Create resource error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Resource Type */}
      <div>
        <label htmlFor="type" className="text-sm font-semibold text-slate-700">
          Resource Type
        </label>

        <select
          id="type"
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        >
          {resourceTypes.map((resourceType) => (
            <option key={resourceType.value} value={resourceType.value}>
              {resourceType.icon} {resourceType.label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="text-sm font-semibold text-slate-700">
          Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. DBMS Unit 1 Handwritten Notes"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="text-sm font-semibold text-slate-700"
        >
          Description{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>

        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Briefly describe this resource..."
          disabled={isSubmitting}
          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* URL */}
      <div>
        <label htmlFor="url" className="text-sm font-semibold text-slate-700">
          Resource URL
        </label>

        <input
          id="url"
          name="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://..."
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        <p className="mt-2 text-xs text-slate-500">
          Add the link to the notes, PDF, website, or YouTube video.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Resource"}
        </button>
      </div>
    </form>
  );
}
