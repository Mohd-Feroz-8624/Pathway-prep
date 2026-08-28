"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useResumeEditor } from "./ResumeEditorShell";

import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModrenTemplate";

export default function ResumeActions() {
  const { resumeData } = useResumeEditor();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const router = useRouter();

  function renderTemplate() {
    switch (resumeData.templateSlug) {
      case "modern":
        return <ModernTemplate resume={resumeData} />;

      case "classic":
      default:
        return <ClassicTemplate resume={resumeData} />;
    }
  }

  function handleExport() {
    window.open(`/print/${resumeData.id}/`, "_blank");
  }

  return (
    <>
      {/* Actions */}
      <div className="flex gap-3 print:hidden">
        {/* Preview */}
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Preview
        </button>

        {/* Export PDF */}
        <button
          type="button"
          onClick={handleExport}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Export PDF
        </button>

        {/* Save */}
        <button
          type="button"
          onClick={() => router.push("/resume")}
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() =>
            router.push(`/resume/templates?resumeId=${resumeData.id}`)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Change Template
        </button>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-100 bg-slate-950/70 backdrop-blur-md print:hidden">
          <div className="relative flex h-screen w-screen items-start justify-center overflow-auto p-6 sm:p-10">
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="fixed right-5 top-5 z-110 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-bold text-slate-700 shadow-xl transition hover:bg-slate-100"
              aria-label="Close preview"
            >
              ×
            </button>

            {/* Full A4 Resume */}
            <div className="w-[210mm] min-w-[210mm] bg-white shadow-2xl">
              {renderTemplate()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
