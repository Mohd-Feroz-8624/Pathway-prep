"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff } from "lucide-react";

import type {
  ResumeTemplateConfig,
  TemplateColumn,
  TemplateSectionConfig,
} from "@/lib/resume-template-config";

type SectionDesignerProps = {
  config: ResumeTemplateConfig;
  onChange: (config: ResumeTemplateConfig) => void;
};

const SECTION_LABELS: Record<string, string> = {
  summary: "Professional Summary",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
};

const COLUMN_OPTIONS: TemplateColumn[] = ["FULL", "LEFT", "RIGHT"];

const SPACING_OPTIONS = ["SMALL", "MEDIUM", "LARGE"] as const;

function sortSections(sections: TemplateSectionConfig[]) {
  return [...sections].sort((a, b) => a.order - b.order);
}

export default function SectionDesigner({
  config,
  onChange,
}: SectionDesignerProps) {
  const sections = sortSections(config.sections);

  const updateHeader = (updates: Partial<ResumeTemplateConfig["header"]>) => {
    onChange({
      ...config,
      header: {
        ...config.header,
        ...updates,
      },
    });
  };

  const updateSection = (
    sectionId: TemplateSectionConfig["id"],
    updates: Partial<TemplateSectionConfig>,
  ) => {
    const nextSections = config.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            ...updates,
          }
        : section,
    );

    onChange({
      ...config,
      sections: nextSections,
    });
  };

  const moveSection = (
    sectionId: TemplateSectionConfig["id"],
    direction: "UP" | "DOWN",
  ) => {
    const sorted = sortSections(config.sections);

    const currentIndex = sorted.findIndex(
      (section) => section.id === sectionId,
    );

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "UP" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sorted.length) {
      return;
    }

    const current = sorted[currentIndex];

    const target = sorted[targetIndex];

    const nextSections = config.sections.map((section) => {
      if (section.id === current.id) {
        return {
          ...section,
          order: target.order,
        };
      }

      if (section.id === target.id) {
        return {
          ...section,
          order: current.order,
        };
      }

      return section;
    });

    onChange({
      ...config,
      sections: nextSections,
    });
  };

  const toggleHeaderField = (
    field:
      | "showName"
      | "showTitle"
      | "showEmail"
      | "showPhone"
      | "showLocation"
      | "showLinkedIn"
      | "showGithub",
  ) => {
    updateHeader({
      [field]: !config.header[field],
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Main Header */}
      <div>
        <p className="text-sm font-semibold text-blue-600">
          Template Structure
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          Resume Designer
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Control the structure, header, visibility, order, columns, titles, and
          spacing of the resume.
        </p>
      </div>

      {/* ========================= */}
      {/* HEADER DESIGNER */}
      {/* ========================= */}

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div>
          <p className="text-sm font-semibold text-blue-600">Header</p>

          <h3 className="mt-1 text-lg font-bold text-slate-950">
            Header Designer
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Control every element displayed in the resume header.
          </p>
        </div>

        {/* Header enabled */}
        <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Header</p>

            <p className="text-xs text-slate-500">
              Show or hide the entire header.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              updateHeader({
                enabled: !config.header.enabled,
              })
            }
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
              config.header.enabled
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {config.header.enabled ? (
              <>
                <Eye className="h-4 w-4" />
                Enabled
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Disabled
              </>
            )}
          </button>
        </div>

        {/* Header controls */}
        <div
          className={`mt-4 space-y-4 ${
            config.header.enabled ? "" : "opacity-50 pointer-events-none"
          }`}
        >
          {/* Alignment */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <label className="text-xs font-semibold text-slate-700">
              Header Alignment
            </label>

            <select
              value={config.header.alignment}
              onChange={(event) =>
                updateHeader({
                  alignment: event.target.value as "LEFT" | "CENTER" | "RIGHT",
                })
              }
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="LEFT">Left</option>

              <option value="CENTER">Center</option>

              <option value="RIGHT">Right</option>
            </select>
          </div>

          {/* Name size */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <label className="text-xs font-semibold text-slate-700">
              Name Size
            </label>

            <select
              value={config.header.nameSize}
              onChange={(event) =>
                updateHeader({
                  nameSize: event.target.value as
                    | "SMALL"
                    | "MEDIUM"
                    | "LARGE"
                    | "EXTRA_LARGE",
                })
              }
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="SMALL">Small</option>

              <option value="MEDIUM">Medium</option>

              <option value="LARGE">Large</option>

              <option value="EXTRA_LARGE">Extra Large</option>
            </select>
          </div>

          {/* Header elements */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold text-slate-700">
              Header Elements
            </p>

            <div className="mt-3 space-y-2">
              {[
                {
                  field: "showName" as const,
                  label: "Name",
                },
                {
                  field: "showTitle" as const,
                  label: "Job Title",
                },
                {
                  field: "showEmail" as const,
                  label: "Email",
                },
                {
                  field: "showPhone" as const,
                  label: "Phone",
                },
                {
                  field: "showLocation" as const,
                  label: "Location",
                },
                {
                  field: "showLinkedIn" as const,
                  label: "LinkedIn",
                },
                {
                  field: "showGithub" as const,
                  label: "GitHub",
                },
              ].map((item) => {
                const enabled = config.header[item.field];

                return (
                  <button
                    key={item.field}
                    type="button"
                    onClick={() => toggleHeaderField(item.field)}
                    className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {item.label}
                    </span>

                    {enabled ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <Eye className="h-3.5 w-3.5" />
                        Visible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                        <EyeOff className="h-3.5 w-3.5" />
                        Hidden
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* LAYOUT */}
      {/* ========================= */}

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <label className="text-sm font-semibold text-slate-900">
          Resume Layout
        </label>

        <p className="mt-1 text-xs text-slate-500">
          Choose whether the resume uses one or two columns.
        </p>

        <select
          value={config.layout.type}
          onChange={(event) => {
            const value = event.target.value as "ONE_COLUMN" | "TWO_COLUMN";

            onChange({
              ...config,
              layout: {
                ...config.layout,
                type: value,
              },
            });
          }}
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="ONE_COLUMN">One Column</option>

          <option value="TWO_COLUMN">Two Columns</option>
        </select>
      </div>

      {/* ========================= */}
      {/* SECTIONS */}
      {/* ========================= */}

      <div className="mt-6">
        <p className="text-sm font-semibold text-blue-600">Resume Sections</p>

        <h3 className="mt-1 text-lg font-bold text-slate-950">
          Section Designer
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Control which sections are displayed, their order, column placement,
          titles, and spacing.
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {sections.map((section, index) => {
          const label = SECTION_LABELS[section.id] ?? section.id;

          return (
            <div
              key={section.id}
              className={`rounded-xl border p-4 transition ${
                section.enabled
                  ? "border-slate-200 bg-white"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              {/* Section header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                    {index + 1}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-950">{label}</h3>

                    <p className="text-xs text-slate-500">
                      {section.enabled
                        ? "Visible on resume"
                        : "Hidden from resume"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateSection(section.id, {
                      enabled: !section.enabled,
                    })
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    section.enabled
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {section.enabled ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hidden
                    </>
                  )}
                </button>
              </div>

              {/* Controls */}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Section Title
                  </label>

                  <input
                    type="text"
                    value={section.title ?? ""}
                    onChange={(event) =>
                      updateSection(section.id, {
                        title: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder={label}
                  />
                </div>

                {/* Column */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Column
                  </label>

                  <select
                    value={section.column}
                    onChange={(event) =>
                      updateSection(section.id, {
                        column: event.target.value as TemplateColumn,
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {COLUMN_OPTIONS.map((column) => (
                      <option key={column} value={column}>
                        {column === "FULL"
                          ? "Full Width"
                          : column === "LEFT"
                            ? "Left Column"
                            : "Right Column"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Spacing */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Section Spacing
                  </label>

                  <select
                    value={section.spacing ?? "MEDIUM"}
                    onChange={(event) =>
                      updateSection(section.id, {
                        spacing: event.target.value as
                          | "SMALL"
                          | "MEDIUM"
                          | "LARGE",
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {SPACING_OPTIONS.map((spacing) => (
                      <option key={spacing} value={spacing}>
                        {spacing.charAt(0) + spacing.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Order */}
                <div>
                  <label className="text-xs font-semibold text-slate-700">
                    Section Order
                  </label>

                  <div className="mt-1.5 flex gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSection(section.id, "UP")}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowUp className="h-4 w-4" />
                      Move Up
                    </button>

                    <button
                      type="button"
                      disabled={index === sections.length - 1}
                      onClick={() => moveSection(section.id, "DOWN")}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowDown className="h-4 w-4" />
                      Move Down
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Information */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-semibold text-blue-900">Admin control</p>

        <p className="mt-1 text-sm leading-6 text-blue-800">
          These settings are stored with the template itself. Students will
          automatically use the structure defined here when they select this
          template.
        </p>
      </div>
    </div>
  );
}
