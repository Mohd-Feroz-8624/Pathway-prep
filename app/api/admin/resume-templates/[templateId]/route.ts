import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ templateId: string }>;
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

    const { templateId } = await params;

    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required." },
        { status: 400 },
      );
    }

    const existingTemplate = await prisma.resumeTemplate.findUnique({
      where: {
        id: templateId,
      },
      select: {
        id: true,
      },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: "Template not found." },
        { status: 404 },
      );
    }

    const body = await request.json();

    const hasPublishUpdate = typeof body.isPublished === "boolean";

    const hasContentUpdate =
      typeof body.name === "string" ||
      typeof body.slug === "string" ||
      typeof body.description === "string" ||
      typeof body.previewUrl === "string";

    // Publish/unpublish only
    if (hasPublishUpdate && !hasContentUpdate) {
      const template = await prisma.resumeTemplate.update({
        where: {
          id: templateId,
        },
        data: {
          isPublished: body.isPublished,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          isPublished: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: template,
      });
    }

    // Full template update
    const name = typeof body.name === "string" ? body.name.trim() : "";

    const slug =
      typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";

    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    const previewUrl =
      typeof body.previewUrl === "string" ? body.previewUrl.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "Template name is required." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Template slug is required." },
        { status: 400 },
      );
    }

    const slugOwner = await prisma.resumeTemplate.findFirst({
      where: {
        slug,
        NOT: {
          id: templateId,
        },
      },
      select: {
        id: true,
      },
    });

    if (slugOwner) {
      return NextResponse.json(
        { error: "A template with this slug already exists." },
        { status: 409 },
      );
    }

    const template = await prisma.resumeTemplate.update({
      where: {
        id: templateId,
      },
      data: {
        name,
        slug,
        description: description || null,
        previewUrl: previewUrl || null,
        ...(hasPublishUpdate && {
          isPublished: body.isPublished,
        }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        previewUrl: true,
        isPublished: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Admin resume template update error:", error);

    return NextResponse.json(
      { error: "Failed to update resume template." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ templateId: string }>;
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

    const { templateId } = await params;

    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required." },
        { status: 400 },
      );
    }

    const template = await prisma.resumeTemplate.findUnique({
      where: {
        id: templateId,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            resumes: true,
          },
        },
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found." },
        { status: 404 },
      );
    }

    if (template._count.resumes > 0) {
      return NextResponse.json(
        {
          error:
            "This template cannot be deleted because it is already being used by student resumes.",
        },
        { status: 409 },
      );
    }

    await prisma.resumeTemplate.delete({
      where: {
        id: templateId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully.",
    });
  } catch (error) {
    console.error("Admin resume template deletion error:", error);

    return NextResponse.json(
      { error: "Failed to delete resume template." },
      { status: 500 },
    );
  }
}
