import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User profile not found",
        },
        { status: 404 },
      );
    }

    const body = await request.json();

    const { taskId, completed } = body;

    if (!taskId || typeof completed !== "boolean") {
      return NextResponse.json(
        {
          error: "taskId and completed are required",
        },
        { status: 400 },
      );
    }

    const task = await prisma.roadmapTask.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return NextResponse.json(
        {
          error: "Roadmap task not found",
        },
        { status: 404 },
      );
    }

    const progress = await prisma.roadmapTaskProgress.upsert({
      where: {
        userId_taskId: {
          userId: user.id,
          taskId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: user.id,
        taskId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Roadmap progress error:", error);

    return NextResponse.json(
      {
        error: "Failed to update roadmap progress",
      },
      { status: 500 },
    );
  }
}
export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User profile not found",
        },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get("roadmapId");

    if (!roadmapId) {
      return NextResponse.json(
        {
          error: "roadmapId is required",
        },
        { status: 400 },
      );
    }

    const progress = await prisma.roadmapTaskProgress.findMany({
      where: {
        userId: user.id,
        task: {
          stage: {
            roadmapId,
          },
        },
      },
      select: {
        taskId: true,
        completed: true,
        completedAt: true,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Get roadmap progress error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch roadmap progress",
      },
      { status: 500 },
    );
  }
}
