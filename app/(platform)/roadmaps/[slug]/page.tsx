import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import RoadmapTasks from "./RoadMapTasks";

type RoadmapPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RoadmapDetailPage({ params }: RoadmapPageProps) {
  const { slug } = await params;

  const roadmap = await prisma.roadmap.findUnique({
    where: {
      slug,
    },
    include: {
      stages: {
        orderBy: {
          order: "asc",
        },
        include: {
          tasks: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
    },
  });

  if (!roadmap || !roadmap.isPublished) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      <section className="border-b bg-white">
        
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          {roadmap.category && (
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              {roadmap.category}
            </span>
          )}

          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {roadmap.title}
          </h1>

          {roadmap.description && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              {roadmap.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {roadmap.duration && (
              <div className="rounded-xl border bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Duration</p>
                <p className="font-semibold text-slate-900">
                  {roadmap.duration}
                </p>
              </div>
            )}

            <div className="rounded-xl border bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Stages</p>
              <p className="font-semibold text-slate-900">
                {roadmap.stages.length}
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Tasks</p>
              <p className="font-semibold text-slate-900">
                {roadmap.stages.reduce(
                  (total, stage) => total + stage.tasks.length,
                  0,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-950">
          Your Learning Path
        </h2>

        <p className="mt-2 text-slate-600">
          Follow each stage in order and complete the tasks along the way.
        </p>

        <RoadmapTasks roadmapId={roadmap.id} stages={roadmap.stages} />
      </section>
    </main>
  );
}
