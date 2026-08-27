import type { ReactNode } from "react";

type ModernTemplateProps = {
  resume: {
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
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-widest text-blue-700">
        {title}
      </h2>

      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function ModernTemplate({ resume }: ModernTemplateProps) {
  return (
    <article className="w-full max-w-[210mm] min-h-[297mm] bg-white px-12 py-10 font-sans text-slate-800 shadow-xl">
      {/* Header */}
      <header className="border-b-2 border-blue-600 pb-5">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
          {resume.title || "My Resume"}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}

          {resume.linkedin && <span>{resume.linkedin}</span>}

          {resume.github && <span>{resume.github}</span>}
        </div>
      </header>

      {/* Summary */}
      {resume.summary && (
        <Section title="Profile">
          <p className="text-sm leading-6 text-slate-600">{resume.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {resume.experience.length > 0 && (
        <Section title="Experience">
          <div className="space-y-5">
            {resume.experience.map((item, index) => (
              <div key={`${item.company}-${index}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {item.position}
                    </h3>

                    <p className="text-sm font-medium text-blue-700">
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
        <Section title="Education">
          <div className="space-y-4">
            {resume.education.map((item, index) => (
              <div key={`${item.institution}-${index}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-950">
                      {item.degree || "Education"}
                    </h3>

                    <p className="text-sm font-medium text-blue-700">
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
        <Section title="Projects">
          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div key={`${project.title}-${index}`}>
                <h3 className="font-bold text-slate-950">{project.title}</h3>

                {project.technologies && (
                  <p className="mt-1 text-xs font-semibold text-blue-700">
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
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <span
                key={`${skill.name}-${index}`}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
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
        <Section title="Certifications">
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
        <Section title="Achievements">
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
    </article>
  );
}
