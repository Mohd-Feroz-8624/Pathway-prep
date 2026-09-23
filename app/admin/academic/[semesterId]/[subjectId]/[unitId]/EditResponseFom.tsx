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

type EditResourceFormProps = {
  resource: {
    id: string;
    type: string;
    title: string;
    description: string | null;
    url: string | null;
  };
  onCancel: () => void;
  onSuccess: () => void;
};

export default function EditResourceForm({
  resource,
  onCancel,
  onSuccess,
}: EditResourceFormProps) {
  const [type, setType] = useState(resource.type);
  const [title, setTitle] = useState(resource.title);
  const [description, setDescription] = useState(resource.description ?? "");
  const [url, setUrl] = useState(resource.url ?? "");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/resources/${resource.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          description,
          url,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update resource.");
        return;
      }

      onSuccess();
    } catch (error) {
      console.error("Update resource error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-6 border-t border-slate-100 pt-6"
    >
      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Type */}
      <div>
        <label
          htmlFor={`edit-type-${resource.id}`}
          className="text-sm font-semibold text-slate-700"
        >
          Resource Type
        </label>

        <select
          id={`edit-type-${resource.id}`}
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
        <label
          htmlFor={`edit-title-${resource.id}`}
          className="text-sm font-semibold text-slate-700"
        >
          Title
        </label>

        <input
          id={`edit-title-${resource.id}`}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor={`edit-description-${resource.id}`}
          className="text-sm font-semibold text-slate-700"
        >
          Description{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>

        <textarea
          id={`edit-description-${resource.id}`}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isSubmitting}
          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* URL */}
      <div>
        <label
          htmlFor={`edit-url-${resource.id}`}
          className="text-sm font-semibold text-slate-700"
        >
          Resource URL
        </label>

        <input
          id={`edit-url-${resource.id}`}
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
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
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
