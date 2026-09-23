import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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

    const body = await request.json();

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const slug =
      typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";

    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    if (!title) {
      return NextResponse.json(
        { error: "Roadmap title is required." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Roadmap slug is required." },
        { status: 400 },
      );
    }

    const existingRoadmap = await prisma.roadmap.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingRoadmap) {
      return NextResponse.json(
        { error: "A roadmap with this slug already exists." },
        { status: 409 },
      );
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        title,
        slug,
        description: description || null,
        isPublished: false,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    console.error("Admin roadmap creation error:", error);

    return NextResponse.json(
      { error: "Failed to create roadmap." },
      { status: 500 },
    );
  }
}
