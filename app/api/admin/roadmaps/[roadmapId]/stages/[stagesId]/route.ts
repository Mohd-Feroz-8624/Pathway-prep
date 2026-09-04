import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(
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

    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Stage title is required." },
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

    const updatedStage = await prisma.roadmapStage.update({
      where: {
        id: stagesId,
      },
      data: {
        title,
        description: description || null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedStage,
    });
  } catch (error) {
    console.error("Admin roadmap stage update error:", error);

    return NextResponse.json(
      { error: "Failed to update stage." },
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

    await prisma.roadmapStage.delete({
      where: {
        id: stagesId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Admin roadmap stage deletion error:", error);

    return NextResponse.json(
      { error: "Failed to delete stage." },
      { status: 500 },
    );
  }
}
