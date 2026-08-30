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
    console.log("Session ID:", sessionId);
    console.log("User ID:", user.id);

    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });
    console.log("Answwer Session:", session);

    if (!session) {
      return NextResponse.json(
        { error: "Interview session not found" },
        { status: 404 },
      );
    }

    if (session.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Interview is already completed" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { questionId, answer } = body;

    if (typeof questionId !== "string" || !questionId.trim()) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 },
      );
    }

    if (typeof answer !== "string") {
      return NextResponse.json(
        { error: "Answer must be a string" },
        { status: 400 },
      );
    }

    const question = await prisma.interviewQuestion.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    const existingAnswer = await prisma.interviewAnswer.findFirst({
      where: {
        sessionId,
        questionId,
      },
    });

    let savedAnswer;

    if (existingAnswer) {
      savedAnswer = await prisma.interviewAnswer.update({
        where: {
          id: existingAnswer.id,
        },
        data: {
          answer,
        },
      });
    } else {
      savedAnswer = await prisma.interviewAnswer.create({
        data: {
          sessionId,
          questionId,
          answer,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Answer saved successfully",
      data: savedAnswer,
    });
  } catch (error) {
    console.error("Save interview answer error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save interview answer",
      },
      { status: 500 },
    );
  }
}
