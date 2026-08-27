import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import DeleteResumeButton from "./DeleteResumeButton";
import CreateResumeButton from "./CreateResumeButton";

export default async function ResumePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      template: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">Resume Builder</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Build Your Professional Resume
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Create a professional, job-ready resume using templates designed for
            students and fresh graduates.
          </p>
        </div>

        {/* Create Resume / Template / Analysis */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-6 print:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
              📄
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-950">
              Create New Resume
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Start building your resume with your education, skills, projects,
              experience, and achievements.
            </p>

            <CreateResumeButton />
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
              🎨
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-950">
              Choose a Template
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Select from professionally designed and ATS-friendly resume
              templates.
            </p>

            <Link
              href="/resume/templates"
              className="mt-6 block w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Browse Templates
            </Link>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">
              📊
            </div>

            <h2 className="mt-6 text-xl font-bold text-slate-950">
              Resume Analysis
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Analyze your resume for ATS compatibility and identify areas that
              can be improved.
            </p>

            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Analyze Resume
            </button>
          </article>
        </div>

        {/* Existing Resumes */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-950">Your Resumes</h2>

          <p className="mt-1 text-sm text-slate-500">
            Your saved resumes will appear here.
          </p>

          {resumes.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                📄
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-950">
                No resumes yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first resume and start building your professional
                profile.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <article
                  key={resume.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                      📄
                    </div>

                    {resume.template?.name && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {resume.template.name}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 truncate text-lg font-bold text-slate-950">
                    {resume.title || "Untitled Resume"}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Last updated{" "}
                    {new Intl.DateTimeFormat("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(resume.updatedAt)}
                  </p>

                  <Link
                    href={`/resume/${resume.id}`}
                    className="mt-5 block w-full rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Edit Resume
                  </Link>
                  <DeleteResumeButton resumeId={resume.id} />
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
