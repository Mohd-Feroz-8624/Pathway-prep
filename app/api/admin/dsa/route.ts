import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await request.json();

    const {
      title,
      slug,
      difficulty,
      topic,
      description,
      constraints,
      examples,
      concept,
      approach,
      timeComplexity,
      spaceComplexity,
      javaSolution,
      pythonSolution,
      javascriptSolution,
      cppSolution,
      isPublished,
    } = body;

    if (!title || !slug || !difficulty || !topic || !description) {
      return NextResponse.json(
        {
          error:
            "Title, slug, difficulty, topic, and description are required.",
        },
        { status: 400 },
      );
    }

    const existingQuestion = await prisma.dSAQuestion.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingQuestion) {
      return NextResponse.json(
        {
          error: "A DSA question with this slug already exists.",
        },
        { status: 409 },
      );
    }

    const question = await prisma.dSAQuestion.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        difficulty: difficulty.trim(),
        topic: topic.trim(),
        description: description.trim(),
        constraints: constraints?.trim() || null,
        examples: examples?.trim() || null,
        concept: concept?.trim() || null,
        approach: approach?.trim() || null,
        timeComplexity: timeComplexity?.trim() || null,
        spaceComplexity: spaceComplexity?.trim() || null,
        javaSolution: javaSolution?.trim() || null,
        pythonSolution: pythonSolution?.trim() || null,
        javascriptSolution: javascriptSolution?.trim() || null,
        cppSolution: cppSolution?.trim() || null,
        isPublished: Boolean(isPublished),
      },
    });

    return NextResponse.json(
      {
        success: true,
        question,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create DSA question error:", error);

    return NextResponse.json(
      {
        error: "Failed to create DSA question.",
      },
      { status: 500 },
    );
  }
}
