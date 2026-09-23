"use client";

import { useState } from "react";

import EditTemplateForm from "./EditTemplateForm";
import TemplatePreview from "./TemplatePreview";
import SectionDesigner from "./SectionDesigner";

import {
  DEFAULT_TEMPLATE_CONFIG,
  type ResumeTemplateConfig,
} from "@/lib/resume-template-config";

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
    designConfig?: unknown;
  };
};

type TemplateDesign = {
  headerAlignment: string;
  layout: string;
  accentColor: string;
  sectionStyle: string;
  nameSize: string;
};

function getInitialConfig(
  designConfig: unknown,
): ResumeTemplateConfig {
  if (
    designConfig &&
    typeof designConfig === "object" &&
    !Array.isArray(designConfig)
  ) {
    const value =
      designConfig as Partial<ResumeTemplateConfig>;

    return {
      ...DEFAULT_TEMPLATE_CONFIG,
      ...value,

      header: {
        ...DEFAULT_TEMPLATE_CONFIG.header,
        ...(value.header ?? {}),
      },

      layout: {
        ...DEFAULT_TEMPLATE_CONFIG.layout,
        ...(value.layout ?? {}),
      },

      page: {
        ...DEFAULT_TEMPLATE_CONFIG.page,
        ...(value.page ?? {}),
      },

      typography: {
        ...DEFAULT_TEMPLATE_CONFIG.typography,
        ...(value.typography ?? {}),
      },

      style: {
        ...DEFAULT_TEMPLATE_CONFIG.style,
        ...(value.style ?? {}),
      },

      sections: Array.isArray(value.sections)
        ? value.sections
        : DEFAULT_TEMPLATE_CONFIG.sections,
    };
  }

  return DEFAULT_TEMPLATE_CONFIG;
}

export default function TemplateEditor({
  template,
}: TemplateEditorProps) {
  const [config, setConfig] =
    useState<ResumeTemplateConfig>(
      getInitialConfig(template.designConfig),
    );

  const [design, setDesign] =
    useState<TemplateDesign>({
      headerAlignment: template.headerAlignment,
      layout: template.layout,
      accentColor: template.accentColor,
      sectionStyle: template.sectionStyle,
      nameSize: template.nameSize,
    });

  function handleDesignChange(
    nextDesign: TemplateDesign,
  ) {
    setDesign(nextDesign);

    setConfig((current) => ({
      ...current,

      header: {
        ...current.header,
        alignment:
          nextDesign.headerAlignment as
            | "LEFT"
            | "CENTER"
            | "RIGHT",
        nameSize:
          nextDesign.nameSize as
            | "SMALL"
            | "MEDIUM"
            | "LARGE"
            | "EXTRA_LARGE",
      },

      layout: {
        ...current.layout,
        type:
          nextDesign.layout as
            | "ONE_COLUMN"
            | "TWO_COLUMN",
      },

      style: {
        ...current.style,
        accentColor:
          nextDesign.accentColor,
        sectionStyle:
          nextDesign.sectionStyle as
            | "SIMPLE"
            | "UNDERLINE"
            | "BOXED",
      },
    }));
  }

  async function handleConfigChange(
    nextConfig: ResumeTemplateConfig,
  ) {
    /*
     * Update preview immediately.
     */
    setConfig(nextConfig);

    /*
     * Keep the legacy design state synchronized.
     */
    setDesign((current) => ({
      ...current,
      headerAlignment:
        nextConfig.header.alignment,
      layout:
        nextConfig.layout.type,
      accentColor:
        nextConfig.style.accentColor,
      sectionStyle:
        nextConfig.style.sectionStyle,
      nameSize:
        nextConfig.header.nameSize,
    }));

    /*
     * Save to database.
     */
    try {
      const response = await fetch(
        `/api/admin/resume-templates/${template.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            designConfig: nextConfig,
          }),
        },
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        console.error(
          "Template configuration save failed:",
          {
            status: response.status,
            error: errorData,
          },
        );
      }
    } catch (error) {
      console.error(
        "Failed to save template configuration:",
        error,
      );
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        {/* EDITOR */}
        <div className="w-full lg:max-w-xl">
          <h2 className="text-xl font-bold text-slate-950">
            Edit Template
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the template and customize its design.
          </p>

          <div className="mt-6">
            <EditTemplateForm
              template={template}
              onDesignChange={handleDesignChange}
            />
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div className="w-full border-t border-slate-100 pt-8 lg:max-w-xl lg:border-t-0 lg:pt-0">
          <h2 className="text-xl font-bold text-slate-950">
            Live Template Preview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Design changes appear here immediately.
          </p>

          <div className="mt-6">
            <TemplatePreview
              slug={template.slug}
              design={design}
              designConfig={config}
            />
          </div>
        </div>
      </div>

      {/* RESUME DESIGNER */}
      <div className="border-t border-slate-200 pt-8">
        <SectionDesigner
          config={config}
          onChange={handleConfigChange}
        />
      </div>
    </div>
  );
}