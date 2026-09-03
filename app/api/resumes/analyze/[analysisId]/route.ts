import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    analysisId: string;
  }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  try {
    // 1. Authenticate user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get analysis ID
    const { analysisId } = await params;

    if (!analysisId) {
      return NextResponse.json(
        { error: "Analysis ID is required." },
        { status: 400 },
      );
    }

    // 3. Find the database user
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 4. Find analysis and verify ownership
    const analysis = await prisma.resumeAnalysis.findFirst({
      where: {
        id: analysisId,
        uploadedResume: {
          userId: user.id,
        },
      },
      include: {
        uploadedResume: {
          select: {
            fileName: true,
            fileType: true,
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: "Resume analysis not found." },
        { status: 404 },
      );
    }

    // 5. Return analysis
    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Get resume analysis error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load resume analysis.",
      },
      { status: 500 },
    );
  }
}
