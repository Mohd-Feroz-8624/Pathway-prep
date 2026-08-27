"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModrenTemplate";

type ResumePreviewProps = {
  resume: React.ComponentProps<typeof ClassicTemplate>["resume"];
  templateSlug?: string | null;
};

export default function ResumePreview({
  resume,
  templateSlug,
}: ResumePreviewProps) {
  const router = useRouter();

  useEffect(() => {
    const handleResumeUpdate = () => {
      router.refresh();
    };

    window.addEventListener("resume-data-updated", handleResumeUpdate);

    return () => {
      window.removeEventListener("resume-data-updated", handleResumeUpdate);
    };
  }, [router]);

 function renderTemplate() {
   switch (templateSlug) {
     case "modern":
       return <ModernTemplate resume={resume} />;

     case "classic":
     default:
       return <ClassicTemplate resume={resume} />;
   }
 }

  return (
    <div className="w-full print-container">
      <div className="mb-4 flex items-center justify-between print-hidden">
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
      <div className="overflow-auto rounded-xl bg-slate-200 p-4 sm:p-6 print-container">
        <div className="mx-auto w-fit">{renderTemplate()}</div>
      </div>
    </div>
  );
}
