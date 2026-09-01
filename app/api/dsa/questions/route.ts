import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.dSAQuestion.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        topic: true,
        constraints: true,
        examples: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("DSA questions error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch DSA questions",
      },
      { status: 500 },
    );
  }
}
