import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

const allowedLanguages = ["Java", "JavaScript", "Python", "C++"];

export async function POST(request: Request) {
  try {
    // 1. Authenticate with Clerk
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Find database user
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }

    // 3. Read request body
    const body = await request.json();

    const questionId = body.questionId;
    const code = body.code;
    const language = body.language;

    // 4. Validate question ID
    if (!questionId || typeof questionId !== "string") {
      return NextResponse.json(
        {
          error: "Question ID is required",
        },
        { status: 400 },
      );
    }

    // 5. Validate code
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        {
          error: "Solution code is required",
        },
        { status: 400 },
      );
    }

    // 6. Validate language
    if (!allowedLanguages.includes(language)) {
      return NextResponse.json(
        {
          error: "Invalid programming language",
        },
        { status: 400 },
      );
    }

    // 7. Make sure the question exists
    const question = await prisma.dSAQuestion.findUnique({
      where: {
        id: questionId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        {
          error: "DSA question not found",
        },
        { status: 404 },
      );
    }

    // 8. Save submission
    const submission = await prisma.dSASubmission.create({
      data: {
        userId: user.id,
        questionId: question.id,
        code: code.trim(),
        language,
        status: "SUBMITTED",
      },
    });

    // 9. Return submission
    return NextResponse.json(
      {
        success: true,
        message: "Solution submitted successfully",
        data: submission,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("DSA submission error:", error);

    return NextResponse.json(
      {
        error: "Failed to submit solution",
      },
      { status: 500 },
    );
  }
}
