import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type TemplateRouteProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function PATCH(request: Request, { params }: TemplateRouteProps) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { resumeId } = await params;

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 },
      );
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const body = await request.json();

    if (!body.templateId || typeof body.templateId !== "string") {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 },
      );
    }

    const template = await prisma.resumeTemplate.findFirst({
      where: {
        id: body.templateId,
        isPublished: true,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    const updatedResume = await prisma.resume.update({
      where: {
        id: resume.id,
      },
      data: {
        templateId: template.id,
      },
      include: {
        template: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Resume template updated successfully",
      data: updatedResume,
    });
  } catch (error) {
    console.error("Update resume template error:", error);

    return NextResponse.json(
      {
        error: "Failed to update resume template",
      },
      { status: 500 },
    );
  }
}
