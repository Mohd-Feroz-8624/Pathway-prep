import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type ExperienceRouteProps = {
  params: Promise<{
    resumeId: string;
    experienceId: string;
  }>;
};

async function getOwnedExperience(
  resumeId: string,
  experienceId: string,
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

  const experience = await prisma.resumeExperience.findFirst({
    where: {
      id: experienceId,
      resumeId,
      resume: {
        userId: user.id,
      },
    },
  });

  if (!experience) {
    return { error: "Experience not found", status: 404 };
  }

  return { experience };
}

export async function PATCH(
  request: Request,
  { params }: ExperienceRouteProps,
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, experienceId } = await params;

    if (!resumeId || !experienceId) {
      return NextResponse.json(
        {
          error: "Resume ID and experience ID are required",
        },
        { status: 400 },
      );
    }

    const result = await getOwnedExperience(resumeId, experienceId, clerkId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const body = await request.json();

    if (
      body.company !== undefined &&
      (typeof body.company !== "string" || !body.company.trim())
    ) {
      return NextResponse.json(
        { error: "Company cannot be empty" },
        { status: 400 },
      );
    }

    if (
      body.position !== undefined &&
      (typeof body.position !== "string" || !body.position.trim())
    ) {
      return NextResponse.json(
        { error: "Position cannot be empty" },
        { status: 400 },
      );
    }

    const isCurrent =
      body.isCurrent !== undefined
        ? body.isCurrent === true
        : result.experience.isCurrent;

    const experience = await prisma.resumeExperience.update({
      where: {
        id: experienceId,
      },
      data: {
        company: body.company !== undefined ? body.company.trim() : undefined,

        position:
          body.position !== undefined ? body.position.trim() : undefined,

        location:
          body.location !== undefined
            ? body.location?.trim() || null
            : undefined,

        startDate:
          body.startDate !== undefined
            ? body.startDate?.trim() || null
            : undefined,

        endDate: isCurrent
          ? null
          : body.endDate !== undefined
            ? body.endDate?.trim() || null
            : undefined,

        isCurrent,

        description:
          body.description !== undefined
            ? body.description?.trim() || null
            : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Update experience error:", error);

    return NextResponse.json(
      { error: "Failed to update experience" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: ExperienceRouteProps,
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, experienceId } = await params;

    if (!resumeId || !experienceId) {
      return NextResponse.json(
        {
          error: "Resume ID and experience ID are required",
        },
        { status: 400 },
      );
    }

    const result = await getOwnedExperience(resumeId, experienceId, clerkId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    await prisma.resumeExperience.delete({
      where: {
        id: experienceId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete experience error:", error);

    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 },
    );
  }
}
