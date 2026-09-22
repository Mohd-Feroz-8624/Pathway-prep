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

    const { roadmapId } = await params;

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID is required." },
        { status: 400 },
      );
    }

    const existingRoadmap = await prisma.roadmap.findUnique({
      where: {
        id: roadmapId,
      },
      select: {
        id: true,
      },
    });

    if (!existingRoadmap) {
      return NextResponse.json(
        { error: "Roadmap not found." },
        { status: 404 },
      );
    }

    const body = await request.json();

    const data: {
      title?: string;
      slug?: string;
      description?: string | null;
      category?: string | null;
      duration?: string | null;
      isPublished?: boolean;
    } = {};

    if (typeof body.title === "string") {
      const title = body.title.trim();

      if (!title) {
        return NextResponse.json(
          { error: "Roadmap title cannot be empty." },
          { status: 400 },
        );
      }

      data.title = title;
    }

    if (typeof body.slug === "string") {
      const slug = body.slug.trim().toLowerCase();

      if (!slug) {
        return NextResponse.json(
          { error: "Roadmap slug cannot be empty." },
          { status: 400 },
        );
      }

      data.slug = slug;
    }

    if (typeof body.description === "string") {
      data.description = body.description.trim() || null;
    } else if (body.description === null) {
      data.description = null;
    }

    if (typeof body.category === "string") {
      data.category = body.category.trim() || null;
    } else if (body.category === null) {
      data.category = null;
    }

    if (typeof body.duration === "string") {
      data.duration = body.duration.trim() || null;
    } else if (body.duration === null) {
      data.duration = null;
    }

    if (typeof body.isPublished === "boolean") {
      data.isPublished = body.isPublished;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 },
      );
    }

    if (data.slug) {
      const duplicateRoadmap = await prisma.roadmap.findFirst({
        where: {
          slug: data.slug,
          NOT: {
            id: roadmapId,
          },
        },
        select: {
          id: true,
        },
      });

      if (duplicateRoadmap) {
        return NextResponse.json(
          { error: "A roadmap with this slug already exists." },
          { status: 409 },
        );
      }
    }

    const updatedRoadmap = await prisma.roadmap.update({
      where: {
        id: roadmapId,
      },
      data,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        duration: true,
        isPublished: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedRoadmap,
    });
  } catch (error) {
    console.error("Admin roadmap update error:", error);

    return NextResponse.json(
      { error: "Failed to update roadmap." },
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

    await prisma.roadmap.delete({
      where: {
        id: roadmapId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Admin roadmap deletion error:", error);

    return NextResponse.json(
      { error: "Failed to delete roadmap." },
      { status: 500 },
    );
  }
}
