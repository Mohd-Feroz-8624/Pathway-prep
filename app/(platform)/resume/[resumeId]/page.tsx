import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import ResumeSummary from "./ResumeSummary";
import ResumeEducation from "./ResumeEducation";
import ResumePersonalInfo from "./ResumePersonalInfo";
import ResumeExperience from "./ResumeExperience";
import ResumeProjects from "./ResumeProjects";
import ResumeSkills from "./ResumeSkills";
import ResumeCertifications from "./ResumeCertifications";
import { prisma } from "@/lib/prisma";

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
      template: true,
      education: true,
      experience: true,
      projects: true,
      skills: true,
      certifications: true,
      achievements: true,
    },
  });

  if (!resume) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
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
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Resume Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add your information to build your resume.
            </p>

            <div className="mt-8 space-y-8">
              {/* Personal Information */}
              <ResumePersonalInfo
                resumeId={resume.id}
                name={user.name ?? ""}
                email={user.email}
                phone={resume.phone ?? ""}
                location={resume.location ?? ""}
                linkedin={resume.linkedin ?? ""}
                github={resume.github ?? ""}
              />

              {/* Summary */}
              <div>
                <ResumeSummary
                  resumeId={resume.id}
                  summary={resume.summary ?? ""}
                />
                <ResumeEducation
                  resumeId={resume.id}
                  education={resume.education}
                />
                <ResumeExperience
                  resumeId={resume.id}
                  experience={resume.experience}
                />
                <ResumeProjects
                  resumeId={resume.id}
                  projects={resume.projects}
                />
                <ResumeSkills resumeId={resume.id} skills={resume.skills} />
                <ResumeCertifications
                  resumeId={resume.id}
                  certifications={resume.certifications}
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
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:h-fit">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-950">Resume Preview</h2>

                <p className="mt-1 text-xs text-slate-500">
                  Live preview will appear here.
                </p>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                Draft
              </span>
            </div>

            <div className="mt-6 aspect-8.5/11 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <div className="h-5 w-40 rounded bg-slate-200" />

              <div className="mt-3 h-3 w-56 rounded bg-slate-200" />

              <div className="mt-8 h-3 w-24 rounded bg-slate-200" />

              <div className="mt-3 h-2 w-full rounded bg-slate-200" />
              <div className="mt-2 h-2 w-5/6 rounded bg-slate-200" />

              <div className="mt-8 h-3 w-28 rounded bg-slate-200" />

              <div className="mt-3 h-2 w-full rounded bg-slate-200" />
              <div className="mt-2 h-2 w-4/5 rounded bg-slate-200" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
