"use client";

import { useState } from "react";

import EditTemplateForm from "./EditTemplateForm";
import TemplatePreview from "./TemplatePreview";

type TemplateEditorProps = {
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
};

type TemplateDesign = {
  headerAlignment: string;
  layout: string;
  accentColor: string;
  sectionStyle: string;
  nameSize: string;
};

export default function TemplateEditor({ template }: TemplateEditorProps) {
  const [design, setDesign] = useState<TemplateDesign>({
    headerAlignment: template.headerAlignment,
    layout: template.layout,
    accentColor: template.accentColor,
    sectionStyle: template.sectionStyle,
    nameSize: template.nameSize,
  });

  return (
    <div className="space-y-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
      <div>
        <h2 className="text-xl font-bold text-slate-950">Edit Template</h2>

        <p className="mt-1 text-sm text-slate-500">
          Update the template and see design changes instantly.
        </p>

        <div className="mt-6">
          <EditTemplateForm template={template} onDesignChange={setDesign} />
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8">
        <h2 className="text-xl font-bold text-slate-950">
          Live Template Preview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Changes to the design settings appear here immediately.
        </p>

        <div className="mt-6">
          <TemplatePreview slug={template.slug} design={design} />
        </div>
      </div>
    </div>
  );
}
