import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type ResumeRouteProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function PATCH(request: Request, { params }: ResumeRouteProps) {
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

    // 3. Get resume ID
    const { resumeId } = await params;

    if (!resumeId) {
      return NextResponse.json(
        {
          error: "Resume ID is required",
        },
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
      return NextResponse.json(
        {
          error: "Resume not found",
        },
        { status: 404 },
      );
    }

    // 5. Read request body
    const body = await request.json();

    // 6. Build partial update object
    const data: {
      title?: string;
      summary?: string | null;
      phone?: string | null;
      location?: string | null;
      linkedin?: string | null;
      github?: string | null;
    } = {};

    if (body.title !== undefined) {
      data.title =
        typeof body.title === "string" ? body.title.trim() : resume.title;
    }

    if (body.summary !== undefined) {
      data.summary = typeof body.summary === "string" ? body.summary : null;
    }

    if (body.phone !== undefined) {
      data.phone = typeof body.phone === "string" ? body.phone : null;
    }

    if (body.location !== undefined) {
      data.location = typeof body.location === "string" ? body.location : null;
    }

    if (body.linkedin !== undefined) {
      data.linkedin = typeof body.linkedin === "string" ? body.linkedin : null;
    }

    if (body.github !== undefined) {
      data.github = typeof body.github === "string" ? body.github : null;
    }

    // 7. Make sure there is something to update
    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          error: "No resume fields provided for update",
        },
        { status: 400 },
      );
    }

    // 8. Update only the fields provided by the client
    const updatedResume = await prisma.resume.update({
      where: {
        id: resumeId,
      },
      data,
    });

    // 9. Return updated resume
    return NextResponse.json({
      success: true,
      message: "Resume updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    return NextResponse.json(
      {
        error: "Failed to update resume",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: ResumeRouteProps) {
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

    // 3. Get resume ID
    const { resumeId } = await params;

    if (!resumeId) {
      return NextResponse.json(
        {
          error: "Resume ID is required",
        },
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
      return NextResponse.json(
        {
          error: "Resume not found",
        },
        { status: 404 },
      );
    }

    // 5. Delete resume
    await prisma.resume.delete({
      where: {
        id: resumeId,
      },
    });

    // 6. Return success
    return NextResponse.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete resume",
      },
      { status: 500 },
    );
  }
}
