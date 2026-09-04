"use client";

import { useState } from "react";

type PublishTemplateButtonProps = {
  templateId: string;
  isPublished: boolean;
};

export default function PublishTemplateButton({
  templateId,
  isPublished,
}: PublishTemplateButtonProps) {
  const [published, setPublished] = useState(isPublished);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    setError("");
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/admin/resume-templates/${templateId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isPublished: !published,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update template status.");
        return;
      }

      setPublished(!published);
    } catch (error) {
      console.error("Template publish update error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isUpdating}
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          published
            ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        {isUpdating
          ? "Updating..."
          : published
            ? "Unpublish Template"
            : "Publish Template"}
      </button>

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
