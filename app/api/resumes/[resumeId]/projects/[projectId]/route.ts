import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type ProjectRouteProps = {
  params: Promise<{
    resumeId: string;
    projectId: string;
  }>;
};

async function getOwnedProject(
  resumeId: string,
  projectId: string,
  clerkId: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!user) {
    return {
      error: "User not found",
      status: 404,
    };
  }

  const project = await prisma.resumeProject.findFirst({
    where: {
      id: projectId,
      resumeId,
      resume: {
        userId: user.id,
      },
    },
  });

  if (!project) {
    return {
      error: "Project not found",
      status: 404,
    };
  }

  return { project };
}

export async function PATCH(request: Request, { params }: ProjectRouteProps) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, projectId } = await params;

    if (!resumeId || !projectId) {
      return NextResponse.json(
        {
          error: "Resume ID and project ID are required",
        },
        { status: 400 },
      );
    }

    const result = await getOwnedProject(resumeId, projectId, clerkId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const body = await request.json();

    if (
      body.title !== undefined &&
      (typeof body.title !== "string" || !body.title.trim())
    ) {
      return NextResponse.json(
        { error: "Project title cannot be empty" },
        { status: 400 },
      );
    }

    const project = await prisma.resumeProject.update({
      where: {
        id: projectId,
      },
      data: {
        title: body.title !== undefined ? body.title.trim() : undefined,

        description:
          body.description !== undefined
            ? body.description?.trim() || null
            : undefined,

        technologies:
          body.technologies !== undefined
            ? body.technologies?.trim() || null
            : undefined,

        githubUrl:
          body.githubUrl !== undefined
            ? body.githubUrl?.trim() || null
            : undefined,

        liveUrl:
          body.liveUrl !== undefined ? body.liveUrl?.trim() || null : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    return NextResponse.json(
      {
        error: "Failed to update project",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: ProjectRouteProps) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, projectId } = await params;

    if (!resumeId || !projectId) {
      return NextResponse.json(
        {
          error: "Resume ID and project ID are required",
        },
        { status: 400 },
      );
    }

    const result = await getOwnedProject(resumeId, projectId, clerkId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    await prisma.resumeProject.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete project",
      },
      { status: 500 },
    );
  }
}
