import type { ResumeData } from "./ClassicTemplate";

import {
  DEFAULT_TEMPLATE_CONFIG,
  type ResumeTemplateConfig,
  type TemplateSectionConfig,
} from "@/lib/resume-template-config";

type ModernTemplateProps = {
  resume: ResumeData;

  templateDesign: {
    headerAlignment: string;
    layout: string;
    accentColor: string;
    sectionStyle: string;
    nameSize: string;
  };

  designConfig?: ResumeTemplateConfig;
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
  accentColorClass: string;
  sectionStyle: string;
  spacing?: "SMALL" | "MEDIUM" | "LARGE";
};

function Section({
  title,
  children,
  accentColorClass,
  sectionStyle,
  spacing = "MEDIUM",
}: SectionProps) {
  const spacingClass =
    spacing === "SMALL" ? "mt-3" : spacing === "LARGE" ? "mt-8" : "mt-5";

  const headingClass =
    sectionStyle === "UNDERLINE"
      ? `border-b-2 border-current pb-1 text-[11px] font-bold uppercase tracking-[0.16em] ${accentColorClass}`
      : sectionStyle === "BOXED"
        ? `rounded-md border border-slate-300 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${accentColorClass}`
        : `border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] ${accentColorClass}`;

  return (
    <section className={spacingClass}>
      <h2 className={headingClass}>{title}</h2>

      <div className="mt-2.5">{children}</div>
    </section>
  );
}

export default function ModernTemplate({
  resume,
  templateDesign,
  designConfig,
}: ModernTemplateProps) {
  const config = designConfig ?? DEFAULT_TEMPLATE_CONFIG;

  const sections = [...config.sections].sort((a, b) => a.order - b.order);

  const getSection = (id: TemplateSectionConfig["id"]) =>
    sections.find((section) => section.id === id);

  const shouldRenderSection = (id: TemplateSectionConfig["id"]) => {
    const section = getSection(id);

    if (!section?.enabled) {
      return false;
    }

    switch (id) {
      case "summary":
        return Boolean(resume.summary);

      case "experience":
        return resume.experience.length > 0;

      case "projects":
        return resume.projects.length > 0;

      case "education":
        return resume.education.length > 0;

      case "skills":
        return resume.skills.length > 0;

      case "certifications":
        return resume.certifications.length > 0;

      case "achievements":
        return resume.achievements.length > 0;

      default:
        return false;
    }
  };

  const getSectionTitle = (id: TemplateSectionConfig["id"], fallback: string) =>
    getSection(id)?.title?.trim() || fallback;

  const headerAlignment =
    config.header.alignment || templateDesign.headerAlignment;

  const headerAlignmentClass =
    headerAlignment === "LEFT"
      ? "text-left"
      : headerAlignment === "RIGHT"
        ? "text-right"
        : "text-center";

  const contactAlignmentClass =
    headerAlignment === "LEFT"
      ? "justify-start"
      : headerAlignment === "RIGHT"
        ? "justify-end"
        : "justify-center";

  const isTwoColumn =
    config.layout.type === "TWO_COLUMN" ||
    templateDesign.layout === "TWO_COLUMN";

  const accentColor = config.style.accentColor || templateDesign.accentColor;

  const sectionStyle = config.style.sectionStyle || templateDesign.sectionStyle;

  const accentColorClass =
    accentColor === "BLUE"
      ? "text-blue-600"
      : accentColor === "GREEN"
        ? "text-green-600"
        : accentColor === "RED"
          ? "text-red-600"
          : accentColor === "PURPLE"
            ? "text-purple-600"
            : "text-slate-900";

  const accentBorderClass =
    accentColor === "BLUE"
      ? "border-blue-600"
      : accentColor === "GREEN"
        ? "border-green-600"
        : accentColor === "RED"
          ? "border-red-600"
          : accentColor === "PURPLE"
            ? "border-purple-600"
            : "border-slate-900";

  const accentSoftClass =
    accentColor === "BLUE"
      ? "bg-blue-50 text-blue-700"
      : accentColor === "GREEN"
        ? "bg-green-50 text-green-700"
        : accentColor === "RED"
          ? "bg-red-50 text-red-700"
          : accentColor === "PURPLE"
            ? "bg-purple-50 text-purple-700"
            : "bg-slate-100 text-slate-700";

  const nameSizeClass =
    config.header.nameSize === "SMALL"
      ? "text-3xl"
      : config.header.nameSize === "MEDIUM"
        ? "text-4xl"
        : config.header.nameSize === "EXTRA_LARGE"
          ? "text-6xl"
          : "text-5xl";

  const renderSection = (section: TemplateSectionConfig) => {
    switch (section.id) {
      case "summary":
        if (!shouldRenderSection("summary")) {
          return null;
        }

        return (
          <Section
            key={section.id}
            title={getSectionTitle("summary", "Profile")}
            {...{
              accentColorClass,
              sectionStyle,
              spacing: section.spacing,
            }}
          >
            <p className="text-sm leading-6 text-slate-600">{resume.summary}</p>
          </Section>
        );

      case "experience":
        if (!shouldRenderSection("experience")) {
          return null;
        }

        return (
          <Section
            key={section.id}
            title={getSectionTitle("experience", "Experience")}
            {...{
              accentColorClass,
              sectionStyle,
              spacing: section.spacing,
            }}
          >
            <div className="space-y-5">
              {resume.experience.map((item, index) => (
                <div key={`${item.company}-${index}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        {item.position}
                      </h3>

                      <p className="text-sm font-medium text-slate-700">
                        {item.company}

                        {item.location ? ` · ${item.location}` : ""}
                      </p>
                    </div>

                    {(item.startDate || item.endDate || item.isCurrent) && (
                      <span className="shrink-0 text-xs font-medium text-slate-500">
                        {item.startDate || ""}

                        {item.startDate && <> — </>}

                        {item.isCurrent ? "Present" : item.endDate || ""}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        );

      case "projects":
        if (!shouldRenderSection("projects")) {
          return null;
        }

        return (
          <Section
            key={section.id}
            title={getSectionTitle("projects", "Projects")}
            {...{
              accentColorClass,
              sectionStyle,
              spacing: section.spacing,
            }}
          >
            <div className="space-y-4">
              {resume.projects.map((project, index) => (
                <div key={`${project.title}-${index}`}>
                  <h3 className="font-bold text-slate-950">{project.title}</h3>

                  {project.technologies && (
                    <p
                      className={`mt-1 text-xs font-semibold ${accentColorClass}`}
                    >
                      {project.technologies}
                    </p>
                  )}

                  {project.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {project.description}
                    </p>
                  )}

                  {(project.githubUrl || project.liveUrl) && (
                    <div className="mt-1 flex gap-3 text-xs text-slate-500">
                      {project.githubUrl && <span>{project.githubUrl}</span>}

                      {project.liveUrl && <span>{project.liveUrl}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        );

      case "education":
        if (!shouldRenderSection("education")) {
          return null;
        }

        return (
          <Section
            key={section.id}
            title={getSectionTitle("education", "Education")}
            {...{
              accentColorClass,
              sectionStyle,
              spacing: section.spacing,
            }}
          >
            <div className="space-y-4">
              {resume.education.map((item, index) => (
                <div key={`${item.institution}-${index}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        {item.degree || "Education"}
                      </h3>

                      <p className="text-sm font-medium text-slate-700">
                        {item.institution}

                        {item.field ? ` · ${item.field}` : ""}
                      </p>
                    </div>

                    {(item.startDate || item.endDate) && (
                      <span className="shrink-0 text-xs text-slate-500">
                        {item.startDate || ""}

                        {" — "}

                        {item.endDate || ""}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        );

      case "skills":
        if (!shouldRenderSection("skills")) {
          return null;
        }

        return (
          <Section
            key={section.id}
            title={getSectionTitle("skills", "Skills")}
            {...{
              accentColorClass,
              sectionStyle,
              spacing: section.spacing,
            }}
          >
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={`${skill.name}-${index}`}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${accentSoftClass}`}
                >
                  {skill.category
                    ? `${skill.category}: ${skill.name}`
                    : skill.name}
                </span>
              ))}
            </div>
          </Section>
        );

      case "certifications":
        if (!shouldRenderSection("certifications")) {
          return null;
        }

        return (
          <Section
            key={section.id}
            title={getSectionTitle("certifications", "Certifications")}
            {...{
              accentColorClass,
              sectionStyle,
              spacing: section.spacing,
            }}
          >
            <div className="space-y-3">
              {resume.certifications.map((certification, index) => (
                <div key={`${certification.name}-${index}`}>
                  <h3 className="font-semibold text-slate-950">
                    {certification.name}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {certification.issuer || ""}

                    {certification.issueDate
                      ? ` · ${certification.issueDate}`
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        );

      case "achievements":
        if (!shouldRenderSection("achievements")) {
          return null;
        }

        return (
          <Section
            key={section.id}
            title={getSectionTitle("achievements", "Achievements")}
            {...{
              accentColorClass,
              sectionStyle,
              spacing: section.spacing,
            }}
          >
            <div className="space-y-3">
              {resume.achievements.map((achievement, index) => (
                <div key={`${achievement.title}-${index}`}>
                  <h3 className="font-semibold text-slate-950">
                    {achievement.title}
                  </h3>

                  {achievement.description && (
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {achievement.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        );

      default:
        return null;
    }
  };

  const fullSections = sections.filter(
    (section) => section.enabled && section.column === "FULL",
  );

  const leftSections = sections.filter(
    (section) => section.enabled && section.column === "LEFT",
  );

  const rightSections = sections.filter(
    (section) => section.enabled && section.column === "RIGHT",
  );

  return (
    <article className="min-h-[297mm] w-full max-w-[210mm] bg-white px-12 py-10 font-sans text-slate-800 shadow-xl">
      {/* HEADER */}
      {config.header.enabled && (
        <header
          className={`${headerAlignmentClass} border-b-2 ${accentBorderClass} pb-5`}
        >
          {config.header.showName && (
            <h1
              className={`${nameSizeClass} font-extrabold tracking-tight ${accentColorClass}`}
            >
              {resume.name || "My Resume"}
            </h1>
          )}

          {config.header.showTitle && resume.title && (
            <p className="mt-1 text-sm font-medium text-slate-600">
              {resume.title}
            </p>
          )}

          <div
            className={`${contactAlignmentClass} mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500`}
          >
            {config.header.showEmail && resume.email && (
              <span>{resume.email}</span>
            )}

            {config.header.showPhone && resume.phone && (
              <span>{resume.phone}</span>
            )}

            {config.header.showLocation && resume.location && (
              <span>{resume.location}</span>
            )}

            {config.header.showLinkedIn && resume.linkedin && (
              <span>{resume.linkedin}</span>
            )}

            {config.header.showGithub && resume.github && (
              <span>{resume.github}</span>
            )}
          </div>
        </header>
      )}

      {/* FULL WIDTH */}
      {fullSections.length > 0 && (
        <div className="mt-6">{fullSections.map(renderSection)}</div>
      )}

      {/* TWO COLUMNS */}
      {isTwoColumn && (
        <div
          className="mt-6 grid grid-cols-1 md:grid-cols-2"
          style={{
            gridTemplateColumns: `${config.layout.leftWidth}fr ${config.layout.rightWidth}fr`,
            columnGap: `${config.layout.gap * 2}px`,
          }}
        >
          <div className="min-w-0">{leftSections.map(renderSection)}</div>

          <div className="min-w-0">{rightSections.map(renderSection)}</div>
        </div>
      )}

      {/* ONE COLUMN */}
      {!isTwoColumn && (
        <div className="mt-6">
          {sections.filter((section) => section.enabled).map(renderSection)}
        </div>
      )}
    </article>
  );
}
