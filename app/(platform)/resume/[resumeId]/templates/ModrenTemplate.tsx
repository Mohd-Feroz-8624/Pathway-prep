type ModernTemplateProps = {
  resume: {
    name: string;
    email: string;
    title: string;
    summary: string | null;
    phone: string | null;
    location: string | null;
    linkedin: string | null;
    github: string | null;

    education: Array<{
      institution: string;
      degree: string | null;
      field: string | null;
      startDate: string | null;
      endDate: string | null;
      description: string | null;
    }>;

    experience: Array<{
      company: string;
      position: string;
      location: string | null;
      startDate: string | null;
      endDate: string | null;
      isCurrent: boolean;
      description: string | null;
    }>;

    projects: Array<{
      title: string;
      description: string | null;
      technologies: string | null;
      githubUrl: string | null;
      liveUrl: string | null;
    }>;

    skills: Array<{
      name: string;
      category: string | null;
    }>;

    certifications: Array<{
      name: string;
      issuer: string | null;
      issueDate: string | null;
      credentialUrl: string | null;
    }>;

    achievements: Array<{
      title: string;
      description: string | null;
    }>;
  };

  templateDesign: {
    headerAlignment: string;
    layout: string;
    accentColor: string;
    sectionStyle: string;
    nameSize: string;
  };
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
  accentColorClass: string;
  sectionStyle: string;
};

function Section({
  title,
  children,
  accentColorClass,
  sectionStyle,
}: SectionProps) {
  const headingClass =
    sectionStyle === "UNDERLINE"
      ? `border-b-2 border-current pb-1 text-[11px] font-bold uppercase tracking-[0.16em] ${accentColorClass}`
      : sectionStyle === "BOXED"
        ? `rounded-md border border-slate-300 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${accentColorClass}`
        : `border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] ${accentColorClass}`;

  return (
    <section className="mt-5">
      <h2 className={headingClass}>{title}</h2>

      <div className="mt-2.5">{children}</div>
    </section>
  );
}

export default function ModernTemplate({
  resume,
  templateDesign,
}: ModernTemplateProps) {
  /* Header alignment */
  const headerAlignmentClass =
    templateDesign.headerAlignment === "LEFT"
      ? "text-left"
      : templateDesign.headerAlignment === "RIGHT"
        ? "text-right"
        : "text-center";

  const contactAlignmentClass =
    templateDesign.headerAlignment === "LEFT"
      ? "justify-start"
      : templateDesign.headerAlignment === "RIGHT"
        ? "justify-end"
        : "justify-center";

  /* Layout */
  const isTwoColumn = templateDesign.layout === "TWO_COLUMN";

  /* Accent colors */
  const accentColorClass =
    templateDesign.accentColor === "BLUE"
      ? "text-blue-600"
      : templateDesign.accentColor === "GREEN"
        ? "text-green-600"
        : templateDesign.accentColor === "RED"
          ? "text-red-600"
          : templateDesign.accentColor === "PURPLE"
            ? "text-purple-600"
            : "text-slate-900";

  const accentBorderClass =
    templateDesign.accentColor === "BLUE"
      ? "border-blue-600"
      : templateDesign.accentColor === "GREEN"
        ? "border-green-600"
        : templateDesign.accentColor === "RED"
          ? "border-red-600"
          : templateDesign.accentColor === "PURPLE"
            ? "border-purple-600"
            : "border-slate-900";

  const accentSoftClass =
    templateDesign.accentColor === "BLUE"
      ? "bg-blue-50 text-blue-700"
      : templateDesign.accentColor === "GREEN"
        ? "bg-green-50 text-green-700"
        : templateDesign.accentColor === "RED"
          ? "bg-red-50 text-red-700"
          : templateDesign.accentColor === "PURPLE"
            ? "bg-purple-50 text-purple-700"
            : "bg-slate-100 text-slate-700";

  /* Name size */
  const nameSizeClass =
    templateDesign.nameSize === "SMALL"
      ? "text-3xl"
      : templateDesign.nameSize === "MEDIUM"
        ? "text-4xl"
        : "text-5xl";

  const sectionProps = {
    accentColorClass,
    sectionStyle: templateDesign.sectionStyle,
  };

  return (
    <article className="min-h-[297mm] w-full max-w-[210mm] bg-white px-12 py-10 font-sans text-slate-800 shadow-xl">
      {/* Header */}
      <header
        className={`${headerAlignmentClass} border-b-2 ${accentBorderClass} pb-5`}
      >
        <h1
          className={`${nameSizeClass} font-extrabold tracking-tight ${accentColorClass}`}
        >
          {resume.name || "My Resume"}
        </h1>

        {resume.title && (
          <p className="mt-1 text-sm font-medium text-slate-600">
            {resume.title}
          </p>
        )}

        <div
          className={`${contactAlignmentClass} mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500`}
        >
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}

          {resume.linkedin && <span>{resume.linkedin}</span>}
          {resume.github && <span>{resume.github}</span>}
        </div>
      </header>

      {/* Resume Content */}
      {isTwoColumn ? (
        <div className="mt-6 grid grid-cols-1 gap-x-8 md:grid-cols-[1fr_2fr]">
          {/* Left Column */}
          <div className="min-w-0">
            {/* Summary */}
            {resume.summary && (
              <Section title="Profile" {...sectionProps}>
                <p className="text-sm leading-6 text-slate-600">
                  {resume.summary}
                </p>
              </Section>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <Section title="Education" {...sectionProps}>
                <div className="space-y-4">
                  {resume.education.map((item, index) => (
                    <div key={`${item.institution}-${index}`}>
                      <h3 className="font-bold text-slate-950">
                        {item.degree || "Education"}
                      </h3>

                      <p className="text-sm font-medium text-slate-700">
                        {item.institution}
                        {item.field ? ` · ${item.field}` : ""}
                      </p>

                      {(item.startDate || item.endDate) && (
                        <span className="text-xs text-slate-500">
                          {item.startDate || ""}
                          {" — "}
                          {item.endDate || ""}
                        </span>
                      )}

                      {item.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <Section title="Skills" {...sectionProps}>
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
            )}

            {/* Certifications */}
            {resume.certifications.length > 0 && (
              <Section title="Certifications" {...sectionProps}>
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
            )}

            {/* Achievements */}
            {resume.achievements.length > 0 && (
              <Section title="Achievements" {...sectionProps}>
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
            )}
          </div>

          {/* Right Column */}
          <div className="min-w-0">
            {/* Experience */}
            {resume.experience.length > 0 && (
              <Section title="Experience" {...sectionProps}>
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

                        {(item.startDate || item.endDate) && (
                          <span className="shrink-0 text-xs font-medium text-slate-500">
                            {item.startDate || ""}
                            {" — "}
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
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
              <Section title="Projects" {...sectionProps}>
                <div className="space-y-4">
                  {resume.projects.map((project, index) => (
                    <div key={`${project.title}-${index}`}>
                      <h3 className="font-bold text-slate-950">
                        {project.title}
                      </h3>

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
                          {project.githubUrl && (
                            <span>{project.githubUrl}</span>
                          )}

                          {project.liveUrl && <span>{project.liveUrl}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      ) : (
        /* One Column Layout */
        <>
          {/* Summary */}
          {resume.summary && (
            <Section title="Profile" {...sectionProps}>
              <p className="text-sm leading-6 text-slate-600">
                {resume.summary}
              </p>
            </Section>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <Section title="Experience" {...sectionProps}>
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

                      {(item.startDate || item.endDate) && (
                        <span className="shrink-0 text-xs font-medium text-slate-500">
                          {item.startDate || ""}
                          {" — "}
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
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <Section title="Education" {...sectionProps}>
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
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <Section title="Projects" {...sectionProps}>
              <div className="space-y-4">
                {resume.projects.map((project, index) => (
                  <div key={`${project.title}-${index}`}>
                    <h3 className="font-bold text-slate-950">
                      {project.title}
                    </h3>

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
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <Section title="Skills" {...sectionProps}>
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
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <Section title="Certifications" {...sectionProps}>
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
          )}

          {/* Achievements */}
          {resume.achievements.length > 0 && (
            <Section title="Achievements" {...sectionProps}>
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
          )}
        </>
      )}
    </article>
  );
}
