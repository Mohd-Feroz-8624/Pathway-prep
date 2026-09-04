"use client";

import { useResumeEditor } from "./ResumeEditorShell";

import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModrenTemplate";

export default function ResumePreview() {
  const { resumeData } = useResumeEditor();
  function renderTemplate() {
    switch (resumeData.templateSlug) {
      case "modern":
        return <ModernTemplate resume={resumeData}
         templateDesign={resumeData.templateDesign} />;

      case "classic":
      default:
        return (
          <ClassicTemplate
            resume={resumeData}
            templateDesign={resumeData.templateDesign}
          />
        );
    }
  }

  return (
    <div className="w-full">
      {/* Preview Header */}
      <div className="mb-4 flex items-center justify-between print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-950">Resume Preview</h2>

          <p className="mt-1 text-xs text-slate-500">
            Live preview of your resume
          </p>
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Live
        </span>
      </div>

      {/* Actual Resume */}
      <div
        id="resume-preview-content"
        className="overflow-auto rounded-xl bg-slate-200 p-4 sm:p-6 print:overflow-visible print:rounded-none print:bg-white print:p-0"
      >
        <div className="mx-auto w-fit print:w-[210mm]">{renderTemplate()}</div>
      </div>
    </div>
  );
}
