import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

import DeleteTemplateButton from "./DeleteTemplateButton";
import PublishTemplateButton from "./PublishTemplateButton";
import TemplateEditor from "./TemplateEditor";

export default async function AdminTemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  await requireAdmin();

  const { templateId } = await params;

  const template = await prisma.resumeTemplate.findUnique({
    where: {
      id: templateId,
    },
  });

  if (!template) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <Link
          href="/admin/templates"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to Resume Templates
        </Link>

        {/* Header */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-blue-600">Admin Panel</p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {template.name}
            </h1>

            <span
              className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                template.isPublished
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {template.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage this resume template and its availability to students.
          </p>
        </div>

        {/* Template Editor + Live Preview */}
        <div className="mt-8">
          <TemplateEditor
            template={{
              id: template.id,
              name: template.name,
              slug: template.slug,
              description: template.description,
              previewUrl: template.previewUrl,
              headerAlignment: template.headerAlignment,
              layout: template.layout,
              accentColor: template.accentColor,
              sectionStyle: template.sectionStyle,
              nameSize: template.nameSize,
              designConfig: template.designConfig,
            }}
          />
        </div>
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between  ">
          

          {/* Template Visibility */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-950">
              Template Visibility
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Control whether students can see and use this template.
            </p>

            <div className="mt-4">
              <PublishTemplateButton
                templateId={template.id}
                isPublished={template.isPublished}
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 border-t border-red-100 pt-6">
            <h2 className="text-xl font-bold text-slate-950">Danger Zone</h2>

            <p className="mt-1 text-sm text-slate-500">
              Deleting a template is permanent and cannot be undone.
            </p>

            <div className="mt-4">
              <DeleteTemplateButton
                templateId={template.id}
                templateName={template.name}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
