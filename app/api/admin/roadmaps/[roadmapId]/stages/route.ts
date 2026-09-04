import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roadmapId: string }> },
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

    const { roadmapId } = await params;

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID is required." },
        { status: 400 },
      );
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: {
        id: roadmapId,
      },
      select: {
        id: true,
      },
    });

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap not found." },
        { status: 404 },
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

    const lastStage = await prisma.roadmapStage.findFirst({
      where: {
        roadmapId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const order = (lastStage?.order ?? 0) + 1;

    const stage = await prisma.roadmapStage.create({
      data: {
        title,
        description: description || null,
        order,
        roadmapId,
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
      data: stage,
    });
  } catch (error) {
    console.error("Admin roadmap stage creation error:", error);

    return NextResponse.json(
      { error: "Failed to create stage." },
      { status: 500 },
    );
  }
}
