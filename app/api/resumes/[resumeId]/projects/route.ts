import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type ProjectRouteProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function POST(request: Request, { params }: ProjectRouteProps) {
  try {
    // 1. Authenticate with Clerk
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find database user
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get resume ID
    const { resumeId } = await params;

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 },
      );
    }

    // 4. Verify resume ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // 5. Read request body
    const body = await request.json();

    // 6. Validate required field
    if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Project title is required" },
        { status: 400 },
      );
    }

    // 7. Create project
    const project = await prisma.resumeProject.create({
      data: {
        resumeId: resume.id,

        title: body.title.trim(),

        description:
          typeof body.description === "string" && body.description.trim()
            ? body.description.trim()
            : null,

        technologies:
          typeof body.technologies === "string" && body.technologies.trim()
            ? body.technologies.trim()
            : null,

        githubUrl:
          typeof body.githubUrl === "string" && body.githubUrl.trim()
            ? body.githubUrl.trim()
            : null,

        liveUrl:
          typeof body.liveUrl === "string" && body.liveUrl.trim()
            ? body.liveUrl.trim()
            : null,
      },
    });

    // 8. Return created project
    return NextResponse.json(
      {
        success: true,
        message: "Project added successfully",
        data: project,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create project error:", error);

    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 },
    );
  }
}
