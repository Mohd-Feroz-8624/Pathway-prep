import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type SkillRouteProps = {
  params: Promise<{
    resumeId: string;
    id: string;
  }>;
};

async function getAuthorizedSkill(resumeId: string, skillId: string) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!user) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
    };
  }

  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: user.id,
    },
  });

  if (!resume) {
    return {
      error: NextResponse.json({ error: "Resume not found" }, { status: 404 }),
    };
  }

  const skill = await prisma.resumeSkill.findFirst({
    where: {
      id: skillId,
      resumeId: resume.id,
    },
  });

  if (!skill) {
    return {
      error: NextResponse.json({ error: "Skill not found" }, { status: 404 }),
    };
  }

  return {
    skill,
  };
}

export async function PATCH(request: Request, { params }: SkillRouteProps) {
  try {
    const { resumeId, id } = await params;

    if (!resumeId || !id) {
      return NextResponse.json(
        { error: "Resume ID and skill ID are required" },
        { status: 400 },
      );
    }

    const authorized = await getAuthorizedSkill(resumeId, id);

    if ("error" in authorized) {
      return authorized.error;
    }

    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 },
      );
    }

    const skill = await prisma.resumeSkill.update({
      where: {
        id: id,
      },
      data: {
        name: body.name.trim(),

        category:
          typeof body.category === "string" && body.category.trim()
            ? body.category.trim()
            : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Update skill error:", error);

    return NextResponse.json(
      { error: "Failed to update skill" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: SkillRouteProps) {
  try {
    const { resumeId, id } = await params;

    if (!resumeId || !id) {
      return NextResponse.json(
        { error: "Resume ID and skill ID are required" },
        { status: 400 },
      );
    }

    const authorized = await getAuthorizedSkill(resumeId, id);

    if ("error" in authorized) {
      return authorized.error;
    }

    await prisma.resumeSkill.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);

    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 },
    );
  }
}
