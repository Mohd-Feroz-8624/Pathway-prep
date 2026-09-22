import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const questionId = body.questionId;

    if (!questionId || typeof questionId !== "string") {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 },
      );
    }

    const question = await prisma.dSAQuestion.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    const progress = await prisma.dSAProgress.upsert({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: question.id,
        },
      },
      update: {
        solved: true,
      },
      create: {
        userId: user.id,
        questionId: question.id,
        solved: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Problem marked as solved",
      data: progress,
    });
  } catch (error) {
    console.error("DSA progress error:", error);

    return NextResponse.json(
      { error: "Failed to update DSA progress" },
      { status: 500 },
    );
  }
}
