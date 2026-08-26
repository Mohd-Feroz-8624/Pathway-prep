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

    // 6. Update resume
    const updatedResume = await prisma.resume.update({
      where: {
        id: resumeId,
      },
      data: {
        phone: body.phone ?? null,
        location: body.location ?? null,
        linkedin: body.linkedin ?? null,
        github: body.github ?? null,
      },
    });

    // 7. Return updated resume
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
