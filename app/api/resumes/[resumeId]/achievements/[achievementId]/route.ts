import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type AchievementRouteProps = {
  params: Promise<{
    resumeId: string;
    achievementId: string;
  }>;
};

async function getOwnedAchievement(
  resumeId: string,
  achievementId: string,
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

  const achievement = await prisma.resumeAchievement.findFirst({
    where: {
      id: achievementId,
      resumeId,
      resume: {
        userId: user.id,
      },
    },
  });

  if (!achievement) {
    return {
      error: "Achievement not found",
      status: 404,
    };
  }

  return { achievement };
}

export async function PATCH(
  request: Request,
  { params }: AchievementRouteProps,
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, achievementId } = await params;

    if (!resumeId || !achievementId) {
      return NextResponse.json(
        {
          error: "Resume ID and achievement ID are required",
        },
        { status: 400 },
      );
    }

    const result = await getOwnedAchievement(resumeId, achievementId, clerkId);

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
        {
          error: "Achievement title cannot be empty",
        },
        { status: 400 },
      );
    }

    const achievement = await prisma.resumeAchievement.update({
      where: {
        id: achievementId,
      },
      data: {
        title: body.title !== undefined ? body.title.trim() : undefined,

        description:
          body.description !== undefined
            ? body.description?.trim() || null
            : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Achievement updated successfully",
      data: achievement,
    });
  } catch (error) {
    console.error("Update achievement error:", error);

    return NextResponse.json(
      {
        error: "Failed to update achievement",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: AchievementRouteProps,
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, achievementId } = await params;

    if (!resumeId || !achievementId) {
      return NextResponse.json(
        {
          error: "Resume ID and achievement ID are required",
        },
        { status: 400 },
      );
    }

    const result = await getOwnedAchievement(resumeId, achievementId, clerkId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    await prisma.resumeAchievement.delete({
      where: {
        id: achievementId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Achievement deleted successfully",
    });
  } catch (error) {
    console.error("Delete achievement error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete achievement",
      },
      { status: 500 },
    );
  }
}
