import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getRoadmaps() {
  return prisma.roadmap.findMany({
    where: {
      isPublished: true,
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
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function RoadmapsPage() {
  const roadmaps = await getRoadmaps();

  return (
    <main className="min-h-screen bg-[#f8f9ff]">
      {/* Hero */}
      <section className="relative overflow-hidden  ">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full " />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:px-8">
          <div className="mx-auto mb-5 inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <span className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
            Career Roadmaps
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Build your career with a{" "}
            <span className="text-blue-600">clear roadmap.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Follow structured learning paths designed to take you from
            fundamentals to job-ready skills.
          </p>
        </div>
      </section>

      {/* Roadmaps */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Choose your learning path
          </h2>

          <p className="mt-2 text-slate-600">
            Pick a roadmap and progress step-by-step toward your career goal.
          </p>
        </div>

        {roadmaps.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No roadmaps available
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Published roadmaps will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {roadmaps.map((roadmap) => {
              const totalTasks = roadmap.stages.reduce(
                (total, stage) => total + stage.tasks.length,
                0,
              );

              return (
                <article
                  key={roadmap.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Card accent */}
                  <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {roadmap.category && (
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {roadmap.category}
                        </span>
                      )}

                      <h3 className="mt-4 text-2xl font-bold text-slate-950">
                        {roadmap.title}
                      </h3>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white">
                      ↗
                    </div>
                  </div>

                  <p className="mt-4 min-h-12 leading-6 text-slate-600">
                    {roadmap.description}
                  </p>

                  {/* Stats */}
                  <div className="mt-7 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Duration
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {roadmap.duration ?? "Flexible"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Stages
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {roadmap.stages.length}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Tasks
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {totalTasks}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/roadmaps/${roadmap.slug}`}
                    className="mt-7 flex items-center justify-between rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white transition-colors hover:bg-blue-600"
                  >
                    <span>Explore Roadmap</span>

                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
