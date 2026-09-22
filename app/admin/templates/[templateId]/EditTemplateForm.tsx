"use client";

import { FormEvent, useState } from "react";

type EditTemplateFormProps = {
  template: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    previewUrl: string | null;
    headerAlignment: string;
    layout: string;
    accentColor: string;
    sectionStyle: string;
    nameSize: string;
  };
  onDesignChange?: (design: {
    headerAlignment: string;
    layout: string;
    accentColor: string;
    sectionStyle: string;
    nameSize: string;
  }) => void;
};

export default function EditTemplateForm({
  template,
  onDesignChange,
}: EditTemplateFormProps) {
  const [name, setName] = useState(template.name);
  const [slug, setSlug] = useState(template.slug);
  const [description, setDescription] = useState(template.description ?? "");

  const [headerAlignment, setHeaderAlignment] = useState(
    template.headerAlignment,
  );
  const [layout, setLayout] = useState(template.layout);
  const [accentColor, setAccentColor] = useState(template.accentColor);
  const [sectionStyle, setSectionStyle] = useState(template.sectionStyle);
  const [nameSize, setNameSize] = useState(template.nameSize);

  function updateDesign(
    field:
      | "headerAlignment"
      | "layout"
      | "accentColor"
      | "sectionStyle"
      | "nameSize",
    value: string,
  ) {
    const nextDesign = {
      headerAlignment,
      layout,
      accentColor,
      sectionStyle,
      nameSize,
      [field]: value,
    };

    if (field === "headerAlignment") {
      setHeaderAlignment(value);
    }

    if (field === "layout") {
      setLayout(value);
    }

    if (field === "accentColor") {
      setAccentColor(value);
    }

    if (field === "sectionStyle") {
      setSectionStyle(value);
    }

    if (field === "nameSize") {
      setNameSize(value);
    }

    onDesignChange?.(nextDesign);
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/admin/resume-templates/${template.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            slug,
            description,
            headerAlignment,
            layout,
            accentColor,
            sectionStyle,
            nameSize,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update template.");
        return;
      }

      setSuccess("Template updated successfully.");
    } catch (error) {
      console.error("Template update error:", error);

      setError("Something went wrong. Please try again.");
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
          onChange={(event) => setName(event.target.value)}
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
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />

        <p className="mt-1.5 text-xs text-slate-500">
          The slug must be unique.
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
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

     

      {/* Design Settings */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-5">
          <h2 className="text-base font-bold text-slate-900">
            Design Settings
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Change the visual appearance of this resume template.
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
              onChange={(event) => updateDesign("headerAlignment", event.target.value)}
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
              onChange={(event) => updateDesign("layout", event.target.value)}
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
              onChange={(event) => updateDesign("accentColor", event.target.value)}
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
              onChange={(event) => updateDesign("sectionStyle", event.target.value)}
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
              onChange={(event) => updateDesign("nameSize", event.target.value)}
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

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}
