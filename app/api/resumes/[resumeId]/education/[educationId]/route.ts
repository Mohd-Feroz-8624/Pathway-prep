import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type EducationRouteProps = {
  params: Promise<{
    resumeId: string;
    educationId: string;
  }>;
};

async function getOwnedEducation(
  resumeId: string,
  educationId: string,
  clerkId: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!user) {
    return { error: "User not found", status: 404 };
  }

  const education = await prisma.resumeEducation.findFirst({
    where: {
      id: educationId,
      resumeId,
      resume: {
        userId: user.id,
      },
    },
  });

  if (!education) {
    return { error: "Education not found", status: 404 };
  }

  return { education };
}

export async function PATCH(request: Request, { params }: EducationRouteProps) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, educationId } = await params;

    if (!resumeId || !educationId) {
      return NextResponse.json(
        { error: "Resume ID and education ID are required" },
        { status: 400 },
      );
    }

    const result = await getOwnedEducation(resumeId, educationId, clerkId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const body = await request.json();

    if (
      body.institution !== undefined &&
      (typeof body.institution !== "string" || !body.institution.trim())
    ) {
      return NextResponse.json(
        { error: "Institution cannot be empty" },
        { status: 400 },
      );
    }

    const education = await prisma.resumeEducation.update({
      where: {
        id: educationId,
      },
      data: {
        institution:
          body.institution !== undefined ? body.institution.trim() : undefined,

        degree:
          body.degree !== undefined ? body.degree?.trim() || null : undefined,

        field:
          body.field !== undefined ? body.field?.trim() || null : undefined,

        startDate:
          body.startDate !== undefined
            ? body.startDate?.trim() || null
            : undefined,

        endDate:
          body.endDate !== undefined ? body.endDate?.trim() || null : undefined,

        description:
          body.description !== undefined
            ? body.description?.trim() || null
            : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Education updated successfully",
      data: education,
    });
  } catch (error) {
    console.error("Update education error:", error);

    return NextResponse.json(
      { error: "Failed to update education" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: EducationRouteProps,
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, educationId } = await params;

    if (!resumeId || !educationId) {
      return NextResponse.json(
        { error: "Resume ID and education ID are required" },
        { status: 400 },
      );
    }

    const result = await getOwnedEducation(resumeId, educationId, clerkId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    await prisma.resumeEducation.delete({
      where: {
        id: educationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Delete education error:", error);

    return NextResponse.json(
      { error: "Failed to delete education" },
      { status: 500 },
    );
  }
}
