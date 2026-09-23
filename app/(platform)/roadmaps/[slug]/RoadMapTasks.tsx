"use client";

import { useState, useEffect } from "react";

type RoadmapTask = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  isRequired: boolean;
  resourceUrl: string | null;
};

type RoadmapStage = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  tasks: RoadmapTask[];
};

type RoadmapTasksProps = {
  roadmapId: string;
  stages: RoadmapStage[];
};

export default function RoadmapTasks({ roadmapId, stages }: RoadmapTasksProps) {
  const allTasks = stages.flatMap((stage) => stage.tasks);

  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch(
          `/api/roadmap-progress?roadmapId=${roadmapId}`,
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        const completed = data
          .filter((item: { completed: boolean }) => item.completed)
          .map((item: { taskId: string }) => item.taskId);

        setCompletedTasks(completed);
      } catch (error) {
        console.error("Failed to load roadmap progress:", error);
      }
    };

    loadProgress();
  }, [roadmapId]);
const toggleTask = async (taskId: string) => {
  const isCurrentlyCompleted = completedTasks.includes(taskId);
  const newCompletedState = !isCurrentlyCompleted;

  setCompletedTasks((current) =>
    newCompletedState
      ? [...current, taskId]
      : current.filter((id) => id !== taskId),
  );

  try {
    const response = await fetch("/api/roadmap-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId,
        completed: newCompletedState,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save progress");
    }
  } catch (error) {
    console.error("Failed to save task progress:", error);

    // Revert optimistic update if the API fails.
    setCompletedTasks((current) =>
      newCompletedState
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  }
};

  const completedCount = completedTasks.length;

  const totalTasks = allTasks.length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="mt-10 space-y-8">
      {/* Progress */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Your Progress</h2>

            <p className="mt-1 text-sm text-slate-500">
              {completedCount} of {totalTasks} tasks completed
            </p>
          </div>

          <span className="text-3xl font-bold text-blue-600">{progress}%</span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stages */}
      <div className="space-y-6">
        {stages.map((stage) => (
          <article
            key={stage.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b bg-slate-50 px-6 py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 font-bold text-white">
                  {stage.order}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-950">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {stage.tasks.length}{" "}
                    {stage.tasks.length === 1 ? "Task" : "Tasks"}
                  </p>

                  {stage.description && (
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="divide-y">
              {stage.tasks.map((task) => {
                const completed = completedTasks.includes(task.id);

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex w-full items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        completed
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {completed && (
                        <span className="text-sm font-bold">✓</span>
                      )}
                    </span>

                    <span className="flex flex-1 items-start gap-4">
                      <span className="pt-0.5 text-sm font-semibold text-slate-400">
                        {String(task.order).padStart(2, "0")}
                      </span>

                      <span className="flex-1">
                        <span
                          className={`block font-medium transition-colors ${
                            completed
                              ? "text-slate-400 line-through"
                              : "text-slate-900"
                          }`}
                        >
                          {task.title}
                        </span>

                        {task.description && (
                          <span className="mt-1 block text-sm text-slate-500">
                            {task.description}
                          </span>
                        )}

                        {task.resourceUrl && !completed && (
                          <a
                            href={task.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Open resource →
                          </a>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
