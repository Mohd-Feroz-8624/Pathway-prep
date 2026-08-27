import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import ResumeSummary from "./ResumeSummary";
import ResumeEducation from "./ResumeEducation";
import ResumePersonalInfo from "./ResumePersonalInfo";
import ResumeExperience from "./ResumeExperience";
import ResumeProjects from "./ResumeProjects";
import ResumeSkills from "./ResumeSkills";
import ResumeCertifications from "./ResumeCertifications";
import ResumePreview from "./ResumePreview";
import ResumeSectionNav from "./ResumeSectionNav";
import ResumeEditorShell from "./ResumeEditorShell";

import { prisma } from "@/lib/prisma";
import ResumeAchievements from "./ResumeAchievements";

type ResumePageProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export default async function ResumeEditorPage({ params }: ResumePageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }
  const { resumeId } = await params;

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: user.id,
    },
    include: {
      education: {
        orderBy: {
          createdAt: "asc",
        },
      },

      experience: {
        orderBy: {
          createdAt: "asc",
        },
      },

      projects: {
        orderBy: {
          createdAt: "asc",
        },
      },

      skills: {
        orderBy: {
          createdAt: "asc",
        },
      },

      certifications: {
        orderBy: {
          createdAt: "asc",
        },
      },

      achievements: {
        orderBy: {
          createdAt: "asc",
        },
      },

      template: true,
    },
  });

  if (!resume) {
    notFound();
  }

  return (
    <ResumeEditorShell
      initialResume={{
        title: resume.title,
        summary: resume.summary,
        phone: resume.phone,
        location: resume.location,
        linkedin: resume.linkedin,
        github: resume.github,
        education: resume.education,
        experience: resume.experience,
        projects: resume.projects,
        skills: resume.skills,
        certifications: resume.certifications,
        achievements: resume.achievements,
        templateSlug: resume.template?.slug ?? null,
      }}
    >
      <main className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Resume Builder
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                {resume.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Build and customize your professional resume.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Preview
              </button>

              <button
                type="button"
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>

          {/* Editor layout */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_420px]">
            {/* Editor */}
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <ResumeSectionNav />
              <h2 className="text-xl font-bold text-slate-950">
                Resume Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add your information to build your resume.
              </p>

              <div className="mt-8 space-y-8">
                {/* Personal Information */}
                <div id="personal-information">
                  <ResumePersonalInfo
                    resumeId={resume.id}
                    name={user.name ?? ""}
                    email={user.email}
                    phone={resume.phone ?? ""}
                    location={resume.location ?? ""}
                    linkedin={resume.linkedin ?? ""}
                    github={resume.github ?? ""}
                  />
                </div>

                {/* Summary */}
                <div id="summary">
                  <ResumeSummary
                    resumeId={resume.id}
                    summary={resume.summary ?? ""}
                  />
                </div>

                <div id="education">
                  <ResumeEducation
                    resumeId={resume.id}
                    education={resume.education}
                  />
                </div>

                <div id="experience">
                  <ResumeExperience
                    resumeId={resume.id}
                    experience={resume.experience}
                  />
                </div>

                <div id="projects">
                  <ResumeProjects
                    resumeId={resume.id}
                    projects={resume.projects}
                  />
                </div>

                <div id="skills">
                  <ResumeSkills resumeId={resume.id} skills={resume.skills} />
                </div>

                <div id="certifications">
                  <ResumeCertifications
                    resumeId={resume.id}
                    certifications={resume.certifications}
                  />

                </div>
                <div id="achievements">
                  <ResumeAchievements
                    resumeId={resume.id}
                    achievements={resume.achievements}
                  />
                </div>

                {/* Sections */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-bold text-slate-950">Education</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {resume.education.length}{" "}
                      {resume.education.length === 1 ? "entry" : "entries"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-bold text-slate-950">Experience</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {resume.experience.length}{" "}
                      {resume.experience.length === 1 ? "entry" : "entries"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-bold text-slate-950">Projects</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {resume.projects.length}{" "}
                      {resume.projects.length === 1 ? "entry" : "entries"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <h3 className="font-bold text-slate-950">Skills</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {resume.skills.length}{" "}
                      {resume.skills.length === 1 ? "skill" : "skills"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Preview placeholder */}
            {/* Resume Preview */}
            <aside className="print-resume rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:h-fit">
              <ResumePreview />
            </aside>
          </div>
        </section>
      </main>
    </ResumeEditorShell>
  );
}
