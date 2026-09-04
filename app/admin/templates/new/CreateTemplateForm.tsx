"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTemplateForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [headerAlignment, setHeaderAlignment] = useState("CENTER");
  const [layout, setLayout] = useState("ONE_COLUMN");
  const [accentColor, setAccentColor] = useState("BLACK");
  const [sectionStyle, setSectionStyle] = useState("SIMPLE");
  const [nameSize, setNameSize] = useState("LARGE");
  const [isPublished, setIsPublished] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/resume-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          previewUrl,
          headerAlignment,
          layout,
          accentColor,
          sectionStyle,
          nameSize,
          isPublished,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create template.");
        return;
      }

      router.push("/admin/templates");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-slate-900">
          Template Name
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
          placeholder="e.g. Modern Professional"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className="text-sm font-semibold text-slate-900">
          Slug
        </label>

        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="modern-professional"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />

        <p className="mt-1.5 text-xs text-slate-500">
          Used as the unique identifier for this template.
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-semibold text-slate-900"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the template..."
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="previewUrl"
          className="text-sm font-semibold text-slate-900"
        >
          Preview URL
        </label>

        <input
          id="previewUrl"
          type="url"
          value={previewUrl}
          onChange={(event) => setPreviewUrl(event.target.value)}
          placeholder="https://example.com/template-preview.png"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1.5 text-xs text-slate-500">
          Optional image URL shown as the template preview.
        </p>
      </div>

      {/* Design Settings */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-5">
          <h2 className="text-base font-bold text-slate-900">
            Design Settings
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Configure how this resume template should look.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="headerAlignment"
              className="text-sm font-semibold text-slate-900"
            >
              Header Alignment
            </label>

            <select
              id="headerAlignment"
              value={headerAlignment}
              onChange={(event) => setHeaderAlignment(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="CENTER">Center</option>
              <option value="LEFT">Left</option>
              <option value="RIGHT">Right</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="layout"
              className="text-sm font-semibold text-slate-900"
            >
              Layout
            </label>

            <select
              id="layout"
              value={layout}
              onChange={(event) => setLayout(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="ONE_COLUMN">One Column</option>
              <option value="TWO_COLUMN">Two Column</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="accentColor"
              className="text-sm font-semibold text-slate-900"
            >
              Accent Color
            </label>

            <select
              id="accentColor"
              value={accentColor}
              onChange={(event) => setAccentColor(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="BLACK">Black</option>
              <option value="BLUE">Blue</option>
              <option value="GREEN">Green</option>
              <option value="RED">Red</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sectionStyle"
              className="text-sm font-semibold text-slate-900"
            >
              Section Style
            </label>

            <select
              id="sectionStyle"
              value={sectionStyle}
              onChange={(event) => setSectionStyle(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="SIMPLE">Simple</option>
              <option value="UNDERLINE">Underline</option>
              <option value="BORDER">Border</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="nameSize"
              className="text-sm font-semibold text-slate-900"
            >
              Name Size
            </label>

            <select
              id="nameSize"
              value={nameSize}
              onChange={(event) => setNameSize(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
              <option value="EXTRA_LARGE">Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300"
        />

        <span>
          <span className="block text-sm font-semibold text-slate-900">
            Publish template
          </span>

          <span className="mt-1 block text-xs leading-5 text-slate-500">
            Published templates are visible to students in the Resume Builder.
          </span>
        </span>
      </label>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creating Template..." : "Create Template"}
      </button>
    </form>
  );
}
