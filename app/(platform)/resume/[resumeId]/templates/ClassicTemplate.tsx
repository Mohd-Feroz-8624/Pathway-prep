import type {
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
  ResumeCertification,
  ResumeAchievement,
} from "@/app/generated/prisma/client";

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
};

function Section({
  title,
  children,
  accentColorClass,
  sectionStyle,
}: {
  title: string;
  children: React.ReactNode;
  accentColorClass: string;
  sectionStyle: string;
}) {
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

export default function ClassicTemplate({
  resume,
  templateDesign,
}: ClassicTemplateProps) {
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

  const isTwoColumn = templateDesign.layout === "TWO_COLUMN";
  const accentColorClass =
    templateDesign.accentColor === "BLUE"
      ? "text-blue-700"
      : templateDesign.accentColor === "GREEN"
        ? "text-green-700"
        : templateDesign.accentColor === "RED"
          ? "text-red-700"
          : templateDesign.accentColor === "PURPLE"
            ? "text-purple-700"
            : "text-slate-950";
  return (
    <article className="mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white px-[18mm] py-[15mm] text-[11px] leading-[1.45] text-slate-800 shadow-sm print:m-0 print:min-h-[297mm] print:w-[210mm] print:shadow-none">
      {/* Header */}
      <header className={headerAlignmentClass}>
        <h1 className={`text-2xl font-bold tracking-tight ${accentColorClass} ${templateDesign.nameSize === "LARGE" ? "text-3xl" : templateDesign.nameSize === "SMALL" ? "text-xl" : templateDesign.nameSize === "MEDIUM" ? "text-2xl" : "text-5xl"}`}>
          {resume.name || "Your Name"}
        </h1>

        <div
          className={`mt-2 flex flex-wrap items-center ${contactAlignmentClass}  gap-x-3 gap-y-1 text-[10px] text-slate-600`}
        >
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}

          {resume.location && <span>{resume.location}</span>}

          {resume.linkedin && (
            <a
              href={resume.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          )}

          {resume.github && (
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
      {/* Resume Content */}
      {isTwoColumn ? (
        <div className="mt-6 grid grid-cols-1 gap-x-8 md:grid-cols-[1fr_2fr]">
          {/* Left Column */}
          <div className="min-w-0">
            {/* Summary */}
            {resume.summary && (
              <Section
                title="Professional Summary"
                accentColorClass={accentColorClass}
                sectionStyle={templateDesign.sectionStyle}
              >
                <p className="text-justify">{resume.summary}</p>
              </Section>
            )}

            {/* Education */}
            {resume.education.length > 0 && (
              <Section
                title="Education"
                accentColorClass={accentColorClass}
                sectionStyle={templateDesign.sectionStyle}
              >
                <div className="space-y-3">
                  {resume.education.map((education) => (
                    <div key={education.id}>
                      <h3 className="font-bold text-slate-950">
                        {education.degree || "Education"}
                      </h3>

                      {education.field && <p>{education.field}</p>}

                      <p>{education.institution}</p>

                      {(education.startDate || education.endDate) && (
                        <p className="text-[10px] text-slate-600">
                          {education.startDate}
                          {education.startDate && education.endDate
                            ? " – "
                            : ""}
                          {education.endDate}
                        </p>
                      )}

                      {education.description && (
                        <p className="mt-1 whitespace-pre-line text-slate-600">
                          {education.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <Section
                title="Skills"
                accentColorClass={accentColorClass}
                sectionStyle={templateDesign.sectionStyle}
              >
                <div className="space-y-1.5">
                  {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category}>
                      <span className="font-bold text-slate-900">
                        {category}:{" "}
                      </span>

                      <span>
                        {skills.map((skill) => skill.name).join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Certifications */}
            {resume.certifications.length > 0 && (
              <Section
                title="Certifications"
                accentColorClass={accentColorClass}
                sectionStyle={templateDesign.sectionStyle}
              >
                <div className="space-y-2">
                  {resume.certifications.map((certification) => (
                    <div key={certification.id}>
                      <h3 className="font-bold text-slate-950">
                        {certification.name}
                      </h3>

                      {certification.issuer && <p>{certification.issuer}</p>}

                      {certification.issueDate && (
                        <p className="text-[10px] text-slate-600">
                          {certification.issueDate}
                        </p>
                      )}

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
                  ))}
                </div>
              </Section>
            )}

            {/* Achievements */}
            {resume.achievements.length > 0 && (
              <Section
                title="Achievements"
                accentColorClass={accentColorClass}
                sectionStyle={templateDesign.sectionStyle}
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
            )}
          </div>

          {/* Right Column */}
          <div className="min-w-0">
            {/* Experience */}
            {resume.experience.length > 0 && (
              <Section
                title="Experience"
                accentColorClass={accentColorClass}
                sectionStyle={templateDesign.sectionStyle}
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
                            {experience.location
                              ? ` · ${experience.location}`
                              : ""}
                          </p>
                        </div>

                        {(experience.startDate ||
                          experience.endDate ||
                          experience.isCurrent) && (
                          <p className="shrink-0 text-right text-[10px] text-slate-600">
                            {experience.startDate}

                            {experience.startDate && <span> – </span>}

                            {experience.isCurrent
                              ? "Present"
                              : experience.endDate}
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
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
              <Section title="Projects" accentColorClass={accentColorClass} sectionStyle={templateDesign.sectionStyle}>
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
            )}
          </div>
        </div>
      ) : (
        /* One Column Layout */
        <>
          {/* Summary */}
          {resume.summary && (
            <Section
              title="Professional Summary "
              accentColorClass={accentColorClass} sectionStyle={templateDesign.sectionStyle}
            >
              <p className="text-justify">{resume.summary}</p>
            </Section>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <Section title="Experience" accentColorClass={accentColorClass} sectionStyle={templateDesign.sectionStyle}>
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
                          {experience.location
                            ? ` · ${experience.location}`
                            : ""}
                        </p>
                      </div>

                      {(experience.startDate ||
                        experience.endDate ||
                        experience.isCurrent) && (
                        <p className="shrink-0 text-right text-[10px] text-slate-600">
                          {experience.startDate}

                          {experience.startDate && <span> – </span>}

                          {experience.isCurrent
                            ? "Present"
                            : experience.endDate}
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
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <Section title="Projects" accentColorClass={accentColorClass} sectionStyle={templateDesign.sectionStyle}>
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
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <Section title="Education" accentColorClass={accentColorClass} sectionStyle={templateDesign.sectionStyle}>
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
                        {education.startDate && education.endDate ? " – " : ""}
                        {education.endDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <Section title="Skills" accentColorClass={accentColorClass} sectionStyle={templateDesign.sectionStyle}>
              <div className="space-y-1.5">
                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category}>
                    <span className="font-bold text-slate-900">
                      {category}:{" "}
                    </span>

                    <span>{skills.map((skill) => skill.name).join(", ")}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <Section title="Certifications" accentColorClass={accentColorClass} sectionStyle={templateDesign.sectionStyle}>
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
          )}

          {/* Achievements */}
          {resume.achievements.length > 0 && (
            <Section title="Achievements" accentColorClass={accentColorClass} sectionStyle={templateDesign.sectionStyle}>
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
          )}
        </>
      )}
    </article>
  );
}
