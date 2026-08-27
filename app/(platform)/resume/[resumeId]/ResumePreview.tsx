"use client";

import { useResumeEditor } from "./ResumeEditorShell";

import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModrenTemplate";

export default function ResumePreview() {
  const { resumeData } = useResumeEditor();

  function renderTemplate() {
    switch (resumeData.templateSlug) {
      case "modern":
        return <ModernTemplate resume={resumeData} />;

      case "classic":
      default:
        return <ClassicTemplate resume={resumeData} />;
    }
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
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

      <div className="overflow-auto rounded-xl bg-slate-200 p-4 sm:p-6">
        <div className="mx-auto w-fit">{renderTemplate()}</div>
      </div>
    </div>
  );
}
