import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type SkillRouteProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function POST(request: Request, { params }: SkillRouteProps) {
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

    // 6. Validate skill name
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Skill name is required" },
        { status: 400 },
      );
    }

    // 7. Create skill
    const skill = await prisma.resumeSkill.create({
      data: {
        resumeId: resume.id,

        name: body.name.trim(),

        category:
          typeof body.category === "string" && body.category.trim()
            ? body.category.trim()
            : null,
      },
    });

    // 8. Return created skill
    return NextResponse.json(
      {
        success: true,
        message: "Skill added successfully",
        data: skill,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create skill error:", error);

    return NextResponse.json({ error: "Failed to add skill" }, { status: 500 });
  }
}
