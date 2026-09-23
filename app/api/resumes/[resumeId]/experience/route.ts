import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type ExperienceRouteProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function POST(request: Request, { params }: ExperienceRouteProps) {
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

    // 6. Validate required fields
    if (
      !body.company ||
      typeof body.company !== "string" ||
      !body.company.trim()
    ) {
      return NextResponse.json(
        {
          error: "Company is required",
        },
        { status: 400 },
      );
    }

    if (
      !body.position ||
      typeof body.position !== "string" ||
      !body.position.trim()
    ) {
      return NextResponse.json(
        {
          error: "Position is required",
        },
        { status: 400 },
      );
    }

    // 7. Create experience
    const experience = await prisma.resumeExperience.create({
      data: {
        resumeId: resume.id,

        company: body.company.trim(),

        position: body.position.trim(),

        location:
          typeof body.location === "string" && body.location.trim()
            ? body.location.trim()
            : null,

        startDate:
          typeof body.startDate === "string" && body.startDate.trim()
            ? body.startDate.trim()
            : null,

        endDate: body.isCurrent
          ? null
          : typeof body.endDate === "string" && body.endDate.trim()
            ? body.endDate.trim()
            : null,

        isCurrent: body.isCurrent === true,

        description:
          typeof body.description === "string" && body.description.trim()
            ? body.description.trim()
            : null,
      },
    });

    // 8. Return created experience
    return NextResponse.json(
      {
        success: true,
        message: "Experience added successfully",
        data: experience,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create experience error:", error);

    return NextResponse.json(
      {
        error: "Failed to add experience",
      },
      { status: 500 },
    );
  }
}
