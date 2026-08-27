"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TemplateCardProps = {
  template: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    previewUrl: string | null;
  };
};

export default function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleUseTemplate() {
    setError("");
    setIsCreating(true);

    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: template.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create resume.");
        return;
      }

      router.push(`/resume/${data.data.id}`);
    } catch (error) {
      console.error("Create resume from template error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Preview */}
      <div className="relative aspect-8.5/11 bg-slate-100 p-5">
        {template.previewUrl ? (
          <Image
            src={template.previewUrl}
            alt={`${template.name} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full rounded-xl border border-slate-200 bg-white p-5">
            <div className="mx-auto h-4 w-32 rounded bg-slate-300" />

            <div className="mx-auto mt-2 h-2.5 w-40 rounded bg-slate-200" />

            <div className="mt-8 h-3 w-20 rounded bg-slate-300" />

            <div className="mt-3 h-2 w-full rounded bg-slate-200" />
            <div className="mt-2 h-2 w-11/12 rounded bg-slate-200" />
            <div className="mt-2 h-2 w-4/5 rounded bg-slate-200" />

            <div className="mt-8 h-3 w-24 rounded bg-slate-300" />

            <div className="mt-3 h-2 w-full rounded bg-slate-200" />
            <div className="mt-2 h-2 w-5/6 rounded bg-slate-200" />

            <div className="mt-8 h-3 w-20 rounded bg-slate-300" />

            <div className="mt-3 h-2 w-full rounded bg-slate-200" />
            <div className="mt-2 h-2 w-4/5 rounded bg-slate-200" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-6">
        <h2 className="text-lg font-bold text-slate-950">{template.name}</h2>

        {template.description && (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {template.description}
          </p>
        )}

        <button
          type="button"
          onClick={handleUseTemplate}
          disabled={isCreating}
          className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? "Creating Resume..." : "Use This Template"}
        </button>

        {error && (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        )}
      </div>
    </article>
  );
}
