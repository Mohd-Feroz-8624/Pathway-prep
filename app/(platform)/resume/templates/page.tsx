import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import TemplateCard from "./TemplateCard";

export default async function TemplatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const templates = await prisma.resumeTemplate.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-blue-600">Resume Builder</p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Choose Your Resume Template
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Choose a professionally designed, ATS-friendly template and start
            building your resume.
          </p>
        </div>

        {templates.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-slate-950">
              No templates available
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Templates will appear here once they are published.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
