import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

async function requireAdminApi() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const admin = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
    select: {
      role: true,
    },
  });

  if (!admin || admin.role !== "ADMIN") {
    return null;
  }

  return admin;
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      roadmapId: string;
      stagesId: string;
      taskId: string;
    }>;
  },
) {
  try {
    const admin = await requireAdminApi();

    if (!admin) {
      const { userId } = await auth();

      return NextResponse.json(
        { error: userId ? "Forbidden" : "Unauthorized" },
        { status: userId ? 403 : 401 },
      );
    }

    const { roadmapId, stagesId, taskId } = await params;

    if (!roadmapId || !stagesId || !taskId) {
      return NextResponse.json(
        {
          error: "Roadmap ID, stage ID, and task ID are required.",
        },
        { status: 400 },
      );
    }

    const existingTask = await prisma.roadmapTask.findFirst({
      where: {
        id: taskId,
        stageId: stagesId,
        stage: {
          roadmapId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    const body = await request.json();

    const data: {
      title?: string;
      description?: string | null;
      resourceUrl?: string | null;
      isRequired?: boolean;
    } = {};

    if (typeof body.title === "string") {
      const title = body.title.trim();

      if (!title) {
        return NextResponse.json(
          { error: "Task title cannot be empty." },
          { status: 400 },
        );
      }

      data.title = title;
    }

    if (typeof body.description === "string") {
      data.description = body.description.trim() || null;
    } else if (body.description === null) {
      data.description = null;
    }

    if (typeof body.resourceUrl === "string") {
      data.resourceUrl = body.resourceUrl.trim() || null;
    } else if (body.resourceUrl === null) {
      data.resourceUrl = null;
    }

    if (typeof body.required === "boolean") {
      data.isRequired = body.required;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 },
      );
    }

    const updatedTask = await prisma.roadmapTask.update({
      where: {
        id: taskId,
      },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        resourceUrl: true,
        isRequired: true,
        order: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error("Admin roadmap task update error:", error);

    return NextResponse.json(
      { error: "Failed to update task." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      roadmapId: string;
      stagesId: string;
      taskId: string;
    }>;
  },
) {
  try {
    const admin = await requireAdminApi();

    if (!admin) {
      const { userId } = await auth();

      return NextResponse.json(
        { error: userId ? "Forbidden" : "Unauthorized" },
        { status: userId ? 403 : 401 },
      );
    }

    const { roadmapId, stagesId, taskId } = await params;

    if (!roadmapId || !stagesId || !taskId) {
      return NextResponse.json(
        {
          error: "Roadmap ID, stage ID, and task ID are required.",
        },
        { status: 400 },
      );
    }

    const existingTask = await prisma.roadmapTask.findFirst({
      where: {
        id: taskId,
        stageId: stagesId,
        stage: {
          roadmapId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    await prisma.roadmapTask.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Admin roadmap task deletion error:", error);

    return NextResponse.json(
      { error: "Failed to delete task." },
      { status: 500 },
    );
  }
}
