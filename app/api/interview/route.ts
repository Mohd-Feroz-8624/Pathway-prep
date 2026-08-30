import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

const allowedRoles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "SDE",
];

const allowedDifficulties = ["Beginner", "Intermediate", "Advanced"];

const allowedTypes = ["Technical", "Behavioral", "Mixed"];

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

    const role = body.role;
    const difficulty = body.difficulty;
    const type = body.type;

    // 4. Validate role
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          error: "Invalid interview role",
        },
        { status: 400 },
      );
    }

    // 5. Validate difficulty
    if (!allowedDifficulties.includes(difficulty)) {
      return NextResponse.json(
        {
          error: "Invalid interview difficulty",
        },
        { status: 400 },
      );
    }

    // 6. Validate interview type
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        {
          error: "Invalid interview type",
        },
        { status: 400 },
      );
    }

    // 7. Find matching questions
    const questions = await prisma.interviewQuestion.findMany({
      where: {
        role,
        difficulty,
        isActive: true,
        ...(type === "Mixed"
          ? {}
          : {
              type,
            }),
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 5,
    });
    console.log(
      "MATCHING INTERVIEW QUESTIONS:",
      questions.length,
      questions.map((question) => question.question),
    );

    // 8. Make sure questions are available
    if (questions.length === 0) {
      return NextResponse.json(
        {
          error:
            "No interview questions are currently available for this selection.",
        },
        { status: 404 },
      );
    }

    // 9. Create interview session
   const session = await prisma.interviewSession.create({
  data: {
    userId: user.id,
    role,
    difficulty,
    type,
    status: "IN_PROGRESS",

    answers: {
      create: questions.map((question) => ({
        questionId: question.id,
        answer: "",
      })),
    },
  },
  include: {
    answers: {
      include: {
        question: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    },
  },
});
      

    // 10. Return session and questions
    return NextResponse.json(
      {
        success: true,
        message: "Interview started successfully",
        data: {
          session,
          questions,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Start interview error:", error);

    return NextResponse.json(
      {
        error: "Failed to start interview",
      },
      { status: 500 },
    );
  }
}
