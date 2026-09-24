import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

import { prisma } from "@/lib/prisma";
import ProfileCard from "@/components/dashboard/ProfileCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import RoadmapProgress from "@/components/dashboard/RoadmapProgress";
import ProfileCompleteness from "@/components/dashboard/ProfileCompleteness";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [
    completedProgress,
    roadmaps,
  ] = await Promise.all([
    prisma.roadmapTaskProgress.findMany({
      where: {
        userId: user.id,
        completed: true,
        task: {
          stage: {
            roadmap: {
              isPublished: true,
            },
          },
        },
      },
      select: {
        taskId: true,
      },
    }),

    prisma.roadmap.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "asc",
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
    }),

    prisma.dSAProgress.count({
      where: {
        userId: user.id,
        solved: true,
      },
    }),

    prisma.dSAQuestion.count(),

    prisma.interviewResult.findFirst({
      where: {
        session: {
          userId: user.id,
          status: "COMPLETED",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        overallScore: true,
      },
    }),

    prisma.resumeAnalysis.findFirst({
      where: {
        uploadedResume: {
          userId: user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        overallScore: true,
      },
    }),
  ]);

  const completedTaskIds = new Set(
    completedProgress.map((progress) => progress.taskId),
  );

  

 

  const roadmapProgress = roadmaps.map((roadmap) => {
    const tasks = roadmap.stages.flatMap((stage) => stage.tasks);

    const completedCount = tasks.filter((task) =>
      completedTaskIds.has(task.id),
    ).length;

    const nextTask = tasks.find((task) => !completedTaskIds.has(task.id));

    const nextTaskStage = nextTask
      ? roadmap.stages.find((stage) =>
          stage.tasks.some((task) => task.id === nextTask.id),
        )
      : null;

    return {
      id: roadmap.id,
      title: roadmap.title,
      slug: roadmap.slug,
      description: roadmap.description,
      totalTasks: tasks.length,
      completedTasks: completedCount,
      nextTask: nextTask
        ? {
            id: nextTask.id,
            title: nextTask.title,
            stageTitle: nextTaskStage?.title ?? null,
          }
        : null,
    };
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl space-y-8 px-6 py-12 lg:px-8">
        <DashboardHeader name={user.name} />

        <ProfileCompleteness
          name={user.name}
          college={user.college}
          branch={user.branch}
          currentSemester={user.currentSemester}
          careerGoal={user.careerGoal}
          github={user.profile?.github ?? null}
          linkedin={user.profile?.linkedin ?? null}
        />
      

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Your Roadmaps</h2>

            <p className="mt-1 text-sm text-slate-500">
              Continue learning from where you left off.
            </p>
          </div>

          <div className="grid gap-4">
            {roadmapProgress.map((roadmap) => (
              <RoadmapProgress
                key={roadmap.id}
                title={roadmap.title}
                description={roadmap.description}
                completedTasks={roadmap.completedTasks}
                totalTasks={roadmap.totalTasks}
                slug={roadmap.slug}
                nextTask={roadmap.nextTask}
              />
            ))}
          </div>
        </div>
        <div className="grid w-full min-w-0 gap-8 items-stretch lg:grid-cols-3">
          <div className="h-full min-w-0 lg:col-span-2">
            <QuickActions />
          </div>
          <div className=" min-w-0">
            <ProfileCard
              name={user.name}
              email={user.email}
              college={user.college}
              branch={user.branch}
              currentSemester={user.currentSemester}
              careerGoal={user.careerGoal}
              github={user.profile?.github ?? null}
              linkedin={user.profile?.linkedin ?? null}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
