import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ questionId: string }>;
  },
) {
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

    const { questionId } = await context.params;
    const body = await request.json();

    const existingQuestion = await prisma.dSAQuestion.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "DSA question not found." },
        { status: 404 },
      );
    }

    // Publish / Unpublish only
    if (
      Object.keys(body).length === 1 &&
      typeof body.isPublished === "boolean"
    ) {
      const updatedQuestion = await prisma.dSAQuestion.update({
        where: {
          id: questionId,
        },
        data: {
          isPublished: body.isPublished,
        },
      });

      return NextResponse.json({
        success: true,
        question: updatedQuestion,
      });
    }

    // Full question update
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

    const duplicateSlug = await prisma.dSAQuestion.findFirst({
      where: {
        slug: slug.trim(),
        NOT: {
          id: questionId,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          error: "A different DSA question already uses this slug.",
        },
        { status: 409 },
      );
    }

    const updatedQuestion = await prisma.dSAQuestion.update({
      where: {
        id: questionId,
      },
      data: {
        title: title.trim(),
        slug: slug.trim(),
        difficulty: difficulty.trim(),
        topic: topic.trim(),
        description: description.trim(),

        constraints:
          typeof constraints === "string" && constraints.trim()
            ? constraints.trim()
            : null,

        examples:
          typeof examples === "string" && examples.trim()
            ? examples.trim()
            : null,

        concept:
          typeof concept === "string" && concept.trim() ? concept.trim() : null,

        approach:
          typeof approach === "string" && approach.trim()
            ? approach.trim()
            : null,

        timeComplexity:
          typeof timeComplexity === "string" && timeComplexity.trim()
            ? timeComplexity.trim()
            : null,

        spaceComplexity:
          typeof spaceComplexity === "string" && spaceComplexity.trim()
            ? spaceComplexity.trim()
            : null,

        javaSolution:
          typeof javaSolution === "string" && javaSolution.trim()
            ? javaSolution.trim()
            : null,

        pythonSolution:
          typeof pythonSolution === "string" && pythonSolution.trim()
            ? pythonSolution.trim()
            : null,

        javascriptSolution:
          typeof javascriptSolution === "string" && javascriptSolution.trim()
            ? javascriptSolution.trim()
            : null,

        cppSolution:
          typeof cppSolution === "string" && cppSolution.trim()
            ? cppSolution.trim()
            : null,

        isPublished:
          typeof isPublished === "boolean"
            ? isPublished
            : existingQuestion.isPublished,
      },
    });

    return NextResponse.json({
      success: true,
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Update DSA question error:", error);

    return NextResponse.json(
      { error: "Failed to update DSA question." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ questionId: string }>;
  },
) {
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

    const { questionId } = await context.params;

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
        { error: "DSA question not found." },
        { status: 404 },
      );
    }

    await prisma.dSAQuestion.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "DSA question deleted successfully.",
    });
  } catch (error) {
    console.error("Delete DSA question error:", error);

    return NextResponse.json(
      { error: "Failed to delete DSA question." },
      { status: 500 },
    );
  }
}