import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find user in database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        name: true,
        careerGoal: true,
        currentSemester: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    const publishedRoadmaps = await prisma.roadmap.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        category: true,
        stages: {
          orderBy: {
            order: "asc",
          },
          select: {
            title: true,
            tasks: {
              orderBy: {
                order: "asc",
              },
              select: {
                id: true,
                title: true,
                progress: {
                  where: {
                    userId: user.id,
                    completed: true,
                  },
                  select: {
                    completed: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const publishedRoadmapIds = publishedRoadmaps.map((roadmap) => roadmap.id);
    const roadmapContext = publishedRoadmaps
      .map((roadmap) => {
        const stages = roadmap.stages
          .map((stage) => {
            const tasks = stage.tasks
              .map((task) => {
                const completed = task.progress.length > 0;

                return `- ${task.title}: ${
                  completed ? "Completed" : "Not completed"
                }`;
              })
              .join("\n");

            return `Stage: ${stage.title}\n${tasks}`;
          })
          .join("\n");

        return `Roadmap: ${roadmap.title}
Category: ${roadmap.category ?? "Not specified"}
${stages}`;
      })
      .join("\n\n");

    const [dsaSolved, dsaTotal, roadmapCompleted, roadmapTotal, dsaQuestions] =
      await Promise.all([
        prisma.dSAProgress.count({
          where: {
            userId: user.id,
            solved: true,
          },
        }),

        prisma.dSAQuestion.count(),

        prisma.roadmapTaskProgress.count({
          where: {
            userId: user.id,
            completed: true,
            task: {
              stage: {
                roadmapId: {
                  in: publishedRoadmapIds,
                },
              },
            },
          },
        }),

        prisma.roadmapTask.count({
          where: {
            stage: {
              roadmapId: {
                in: publishedRoadmapIds,
              },
            },
          },
        }),

        prisma.dSAQuestion.findMany({
          select: {
            id: true,
            topic: true,
            progress: {
              where: {
                userId: user.id,
                solved: true,
              },
              select: {
                solved: true,
              },
            },
          },
        }),
      ]);
    const dsaTopicMap = new Map<string, { total: number; solved: number }>();

    for (const question of dsaQuestions) {
      const existing = dsaTopicMap.get(question.topic) ?? {
        total: 0,
        solved: 0,
      };

      existing.total += 1;

      if (question.progress.length > 0) {
        existing.solved += 1;
      }

      dsaTopicMap.set(question.topic, existing);
    }

    const dsaTopicContext = Array.from(dsaTopicMap.entries())
      .map(
        ([topic, stats]) => `- ${topic}: ${stats.solved}/${stats.total} solved`,
      )
      .join("\n");
    // 3. Read request body
    const body = await request.json();

    const message = body.message;
    const history = body.history;

    if (!Array.isArray(history)) {
      return NextResponse.json(
        { error: "Invalid conversation history." },
        { status: 400 },
      );
    }

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    // 4. Prepare Pathway AI context
    const systemPrompt = `
You are Pathway AI, the AI career and learning assistant
inside the Pathway Prep platform.

Help students with:
- Career guidance
- Learning paths
- DSA preparation
- Academic preparation
- Resume preparation
- Mock interview preparation
- Pathway Prep platform features

Student context:
Name: ${user.name ?? "Student"}
Career goal: ${user.careerGoal ?? "Not specified"}
Current semester: ${user.currentSemester ?? "Not specified"}

Actual Pathway Prep progress:
DSA problems solved: ${dsaSolved} / ${dsaTotal}
Roadmap tasks completed: ${roadmapCompleted} / ${roadmapTotal}

DSA topic progress:
${dsaTopicContext}

Roadmap details:
${roadmapContext}

Rules:
1. Give practical and clear answers.
2. Keep answers relevant to career and learning.
3. Do not invent information about the student's progress.
4. If you do not know something, say so.
5. Explain programming, DSA, academics, careers,
   resumes, and interview preparation when asked.
6. Do not claim that you performed an action when you did not.
7. Keep responses concise but useful.
8. When discussing the student's progress, use only the
   actual progress data provided above.

9. Do not invent completed tasks, solved problems, or
   progress percentages.
10. When recommending the student's next roadmap task,
    prefer the first incomplete task in their relevant
    career roadmap.
11. Do not say a task is completed unless the provided
    progress data says it is completed.
12. When recommending DSA topics, use the actual topic
    progress provided above. Prefer topics with lower
    completion when appropriate, while considering the
    student's career goal and preparation needs.
13. When giving career or learning recommendations,
    prioritize the student's stated career goal.
14. Since the currently available published roadmap is the
    Full Stack Developer roadmap, use it when the student's
    career goal is Full Stack Developer.
15. Do not recommend a different career path unless the
    student explicitly asks to explore alternatives.
16. When recommending what to learn next, consider both
    the student's incomplete roadmap tasks and DSA topic
    progress.

17. Never claim that a task or DSA topic is completed
    unless the provided database context says it is.
`;

    // 5. Send request to Groq
    const conversation = history
      .filter(
        (
          item: unknown,
        ): item is { role: "user" | "assistant"; content: string } =>
          typeof item === "object" &&
          item !== null &&
          "role" in item &&
          "content" in item &&
          (item.role === "user" || item.role === "assistant") &&
          typeof item.content === "string",
      )
      .slice(-20);

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...conversation,
        {
          role: "user",
          content: message.trim(),
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    // 6. Read AI response
    const answer = completion.choices[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("Pathway AI returned an empty response.");
    }

    // 7. Return response
    return NextResponse.json({
      success: true,
      data: {
        answer,
      },
    });
  } catch (error) {
    console.error("Pathway AI error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to get AI response.",
      },
      { status: 500 },
    );
  }
}
