import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      roadmapId: string;
      stagesId: string;
    }>;
  },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { roadmapId, stagesId } = await params;

    if (!roadmapId || !stagesId) {
      return NextResponse.json(
        { error: "Roadmap ID and stage ID are required." },
        { status: 400 },
      );
    }

    const stage = await prisma.roadmapStage.findFirst({
      where: {
        id: stagesId,
        roadmapId,
      },
      select: {
        id: true,
      },
    });

    if (!stage) {
      return NextResponse.json({ error: "Stage not found." }, { status: 404 });
    }

    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    const resourceUrl =
      typeof body.resourceUrl === "string" ? body.resourceUrl.trim() : "";

    const isRequired = typeof body.required === "boolean" ? body.required : true;

    if (!title) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 },
      );
    }

    const lastTask = await prisma.roadmapTask.findFirst({
      where: {
        stageId: stagesId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const order = (lastTask?.order ?? 0) + 1;

    const task = await prisma.roadmapTask.create({
      data: {
        title,
        description: description || null,
        resourceUrl: resourceUrl || null,
        isRequired,
        order,
        stageId: stagesId,
      },
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
      data: task,
    });
  } catch (error) {
    console.error("Admin roadmap task creation error:", error);

    return NextResponse.json(
      { error: "Failed to create task." },
      { status: 500 },
    );
  }
}
