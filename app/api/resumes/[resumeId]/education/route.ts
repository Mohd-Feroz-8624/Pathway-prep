import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type EducationRouteProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function POST(request: Request, { params }: EducationRouteProps) {
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

    // 6. Validate required field
    if (
      !body.institution ||
      typeof body.institution !== "string" ||
      !body.institution.trim()
    ) {
      return NextResponse.json(
        {
          error: "Institution is required",
        },
        { status: 400 },
      );
    }

    // 7. Create education
    const education = await prisma.resumeEducation.create({
      data: {
        resumeId: resume.id,
        institution: body.institution.trim(),
        degree:
          typeof body.degree === "string" && body.degree.trim()
            ? body.degree.trim()
            : null,
        field:
          typeof body.field === "string" && body.field.trim()
            ? body.field.trim()
            : null,
        startDate:
          typeof body.startDate === "string" && body.startDate.trim()
            ? body.startDate.trim()
            : null,
        endDate:
          typeof body.endDate === "string" && body.endDate.trim()
            ? body.endDate.trim()
            : null,
        description:
          typeof body.description === "string" && body.description.trim()
            ? body.description.trim()
            : null,
      },
    });

    // 8. Return created education
    return NextResponse.json(
      {
        success: true,
        message: "Education added successfully",
        data: education,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create education error:", error);

    return NextResponse.json(
      {
        error: "Failed to add education",
      },
      { status: 500 },
    );
  }
}
