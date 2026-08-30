import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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

    // 3. Read questionId from URL
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        {
          error: "Question ID is required",
        },
        { status: 400 },
      );
    }

    // 4. Get only this user's submissions
    const submissions = await prisma.dSASubmission.findMany({
      where: {
        userId: user.id,
        questionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        code: true,
        language: true,
        status: true,
        score: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error("DSA submission history error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch submission history",
      },
      { status: 500 },
    );
  }
}
