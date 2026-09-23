"use client";
import Image from "next/image";

type TemplateOption = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  previewUrl: string | null;
};

type TemplateSelectorProps = {
  templates: TemplateOption[];
  selectedTemplateId: string | null;
  onSelect: (templateId: string) => void;
};

export default function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelect,
}: TemplateSelectorProps) {
  
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-950">Resume Template</h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose a template for your resume.
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm text-slate-500">No templates available yet.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {templates.map((template) => {
            const isSelected = template.id === selectedTemplateId;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelect(template.id)}
                className={`group overflow-hidden rounded-2xl border text-left transition ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {/* Template Preview */}
                <div className="relative aspect-8.5/11 bg-slate-100 p-4">
                  {template.previewUrl ? (
                    <Image
                      src={template.previewUrl}
                      alt={`${template.name} preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-full rounded-lg border border-slate-200 bg-white p-4">
                      <div className="mx-auto h-3 w-24 rounded bg-slate-300" />

                      <div className="mx-auto mt-2 h-2 w-32 rounded bg-slate-200" />

                      <div className="mt-6 h-2 w-16 rounded bg-slate-300" />

                      <div className="mt-2 h-2 w-full rounded bg-slate-200" />
                      <div className="mt-1.5 h-2 w-5/6 rounded bg-slate-200" />

                      <div className="mt-6 h-2 w-20 rounded bg-slate-300" />

                      <div className="mt-2 h-2 w-full rounded bg-slate-200" />
                      <div className="mt-1.5 h-2 w-4/5 rounded bg-slate-200" />
                    </div>
                  )}
                </div>

                {/* Template Information */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {template.name}
                      </h3>

                      {template.description && (
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {template.description}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
