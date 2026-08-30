import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function POST(request: Request, { params }: RouteProps) {
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

    const { sessionId } = await params;
    console.log("finish sessionId", sessionId);
    console.log("finish userId", user.id);

    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Interview session not found" },
        { status: 404 },
      );
    }

    const updatedSession = await prisma.interviewSession.update({
      where: {
        id: session.id,
      },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Interview completed successfully",
      data: updatedSession,
    });
  } catch (error) {
    console.error("Finish interview error:", error);

    return NextResponse.json(
      {
        error: "Failed to finish interview",
      },
      { status: 500 },
    );
  }
}
