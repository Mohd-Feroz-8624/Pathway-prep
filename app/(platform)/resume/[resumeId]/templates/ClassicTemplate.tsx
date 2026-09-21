import type {
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
  ResumeCertification,
  ResumeAchievement,
} from "@/app/generated/prisma/client";

import {
  DEFAULT_TEMPLATE_CONFIG,
  type ResumeTemplateConfig,
  type TemplateSectionConfig,
} from "@/lib/resume-template-config";

export type ResumeData = {
  name: string;
  email: string;
  title: string;
  summary: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;

  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: ResumeSkill[];
  certifications: ResumeCertification[];
  achievements: ResumeAchievement[];

  templateDesign?: {
    headerAlignment: string;
    layout: string;
    accentColor: string;
    sectionStyle: string;
    nameSize: string;
  };
};

type ClassicTemplateProps = {
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

function Section({
  title,
  children,
  accentColorClass,
  sectionStyle,
  spacing = "MEDIUM",
}: {
  title: string;
  children: React.ReactNode;
  accentColorClass: string;
  sectionStyle: string;
  spacing?: "SMALL" | "MEDIUM" | "LARGE";
}) {
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

export default function ClassicTemplate({
  resume,
  templateDesign,
  designConfig,
}: ClassicTemplateProps) {
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

  const groupedSkills = resume.skills.reduce<Record<string, ResumeSkill[]>>(
    (groups, skill) => {
      const category = skill.category || "Skills";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(skill);

      return groups;
    },
    {},
  );

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
      ? "text-blue-700"
      : accentColor === "GREEN"
        ? "text-green-700"
        : accentColor === "RED"
          ? "text-red-700"
          : accentColor === "PURPLE"
            ? "text-purple-700"
            : "text-slate-950";

  const renderSection = (section: TemplateSectionConfig) => {
    switch (section.id) {
      case "summary":
        if (!shouldRenderSection("summary")) {
          return null;
        }

        return (
          <Section
            key={section.id}
            title={getSectionTitle("summary", "Professional Summary")}
            accentColorClass={accentColorClass}
            sectionStyle={sectionStyle}
            spacing={section.spacing}
          >
            <p className="text-justify">{resume.summary}</p>
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
            accentColorClass={accentColorClass}
            sectionStyle={sectionStyle}
            spacing={section.spacing}
          >
            <div className="space-y-6">
              {resume.experience.map((experience) => (
                <div key={experience.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        {experience.position}
                      </h3>

                      <p className="font-medium">
                        {experience.company}

                        {experience.location ? ` · ${experience.location}` : ""}
                      </p>
                    </div>

                    {(experience.startDate ||
                      experience.endDate ||
                      experience.isCurrent) && (
                      <p className="shrink-0 text-right text-[10px] text-slate-600">
                        {experience.startDate}

                        {experience.startDate && <span> – </span>}

                        {experience.isCurrent ? "Present" : experience.endDate}
                      </p>
                    )}
                  </div>

                  {experience.description && (
                    <p className="mt-1.5 whitespace-pre-line text-slate-700">
                      {experience.description}
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
            accentColorClass={accentColorClass}
            sectionStyle={sectionStyle}
            spacing={section.spacing}
          >
            <div className="space-y-4">
              {resume.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="font-bold text-slate-950">
                      {project.title}
                    </h3>

                    {project.technologies && (
                      <span className="text-[10px] text-slate-600">
                        | {project.technologies}
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p className="mt-1 whitespace-pre-line">
                      {project.description}
                    </p>
                  )}

                  {(project.githubUrl || project.liveUrl) && (
                    <div className="mt-1 flex gap-3 text-[10px]">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          GitHub
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          Live Demo
                        </a>
                      )}
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
            accentColorClass={accentColorClass}
            sectionStyle={sectionStyle}
            spacing={section.spacing}
          >
            <div className="space-y-3">
              {resume.education.map((education) => (
                <div
                  key={education.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {education.degree || "Education"}
                    </h3>

                    {education.field && <p>{education.field}</p>}

                    <p>{education.institution}</p>

                    {education.description && (
                      <p className="mt-1 whitespace-pre-line text-slate-600">
                        {education.description}
                      </p>
                    )}
                  </div>

                  {(education.startDate || education.endDate) && (
                    <p className="shrink-0 text-right text-[10px] text-slate-600">
                      {education.startDate}

                      {education.startDate && education.endDate && (
                        <span> – </span>
                      )}

                      {education.endDate}
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
            accentColorClass={accentColorClass}
            sectionStyle={sectionStyle}
            spacing={section.spacing}
          >
            <div className="space-y-1.5">
              {Object.entries(groupedSkills).map(([category, skills]) => (
                <div key={category}>
                  <span className="font-bold text-slate-900">{category}: </span>

                  <span>{skills.map((skill) => skill.name).join(", ")}</span>
                </div>
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
            accentColorClass={accentColorClass}
            sectionStyle={sectionStyle}
            spacing={section.spacing}
          >
            <div className="space-y-2">
              {resume.certifications.map((certification) => (
                <div
                  key={certification.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {certification.name}
                    </h3>

                    {certification.issuer && <p>{certification.issuer}</p>}

                    {certification.credentialUrl && (
                      <a
                        href={certification.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] hover:underline"
                      >
                        Credential
                      </a>
                    )}
                  </div>

                  {certification.issueDate && (
                    <p className="shrink-0 text-[10px] text-slate-600">
                      {certification.issueDate}
                    </p>
                  )}
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
            accentColorClass={accentColorClass}
            sectionStyle={sectionStyle}
            spacing={section.spacing}
          >
            <div className="space-y-2">
              {resume.achievements.map((achievement) => (
                <div key={achievement.id}>
                  <h3 className="font-bold text-slate-950">
                    {achievement.title}
                  </h3>

                  {achievement.description && (
                    <p className="mt-0.5 whitespace-pre-line">
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
    <article className="mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white px-[18mm] py-[15mm] text-[11px] leading-[1.45] text-slate-800 shadow-sm print:m-0 print:min-h-[297mm] print:w-[210mm] print:shadow-none">
      {/* HEADER */}
      {config.header.enabled && (
        <header className={headerAlignmentClass}>
          {config.header.showName && (
            <h1
              className={`font-bold tracking-tight ${accentColorClass} ${
                config.header.nameSize === "SMALL"
                  ? "text-xl"
                  : config.header.nameSize === "MEDIUM"
                    ? "text-2xl"
                    : config.header.nameSize === "EXTRA_LARGE"
                      ? "text-5xl"
                      : "text-3xl"
              }`}
            >
              {resume.name || "Your Name"}
            </h1>
          )}

          {config.header.showTitle && resume.title && (
            <p className="mt-1 text-sm font-medium text-slate-600">
              {resume.title}
            </p>
          )}

          <div
            className={`mt-2 flex flex-wrap items-center ${contactAlignmentClass} gap-x-3 gap-y-1 text-[10px] text-slate-600`}
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
              <a
                href={resume.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            )}

            {config.header.showGithub && resume.github && (
              <a
                href={resume.github}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            )}
          </div>
        </header>
      )}

      {/* CONTENT */}
      {isTwoColumn ? (
        <>
          {/* FULL WIDTH */}
          {fullSections.length > 0 && (
            <div className="mt-6">{fullSections.map(renderSection)}</div>
          )}

          {/* COLUMNS */}
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
        </>
      ) : (
        <div className="mt-6">
          {sections.filter((section) => section.enabled).map(renderSection)}
        </div>
      )}
    </article>
  );
}
