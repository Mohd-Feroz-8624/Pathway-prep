import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Authenticate with Clerk
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Find database user
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }

    // 3. Read optional template ID
    let templateId: string | undefined;

    try {
      const body = await request.json();

      if (
        body.templateId !== undefined &&
        typeof body.templateId === "string"
      ) {
        templateId = body.templateId;
      }
    } catch {
      // Empty request body is allowed.
    }

    // 4. Determine template
    let selectedTemplate;

    if (templateId) {
      selectedTemplate = await prisma.resumeTemplate.findFirst({
        where: {
          id: templateId,
          isPublished: true,
        },
      });

      if (!selectedTemplate) {
        return NextResponse.json(
          {
            error: "Selected template not found",
          },
          { status: 404 },
        );
      }
    } else {
      selectedTemplate = await prisma.resumeTemplate.findUnique({
        where: {
          slug: "classic",
        },
      });

      if (!selectedTemplate) {
        return NextResponse.json(
          {
            error: "Classic resume template not found",
          },
          { status: 404 },
        );
      }
    }

    // 5. Create resume
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: "My Resume",
        templateId: selectedTemplate.id,
      },
      include: {
        template: true,
      },
    });

    // 6. Return created resume
    return NextResponse.json(
      {
        success: true,
        message: "Resume created successfully",
        data: resume,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create resume error:", error);

    return NextResponse.json(
      {
        error: "Failed to create resume",
      },
      { status: 500 },
    );
  }
}
