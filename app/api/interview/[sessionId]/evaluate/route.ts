import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

    const session = await prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId: user.id,
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Interview session not found" },
        { status: 404 },
      );
    }

    if (session.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Interview is not completed yet" },
        { status: 400 },
      );
    }

    if (session.answers.length === 0) {
      return NextResponse.json(
        { error: "No answers found for this interview" },
        { status: 400 },
      );
    }

    const results = [];

    for (const answer of session.answers) {
      const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's answer to the following interview question.

Question:
${answer.question.question}

Evaluation Guide:
${answer.question.evaluationGuide}

Candidate Answer:
${answer.answer}

Give a score from 0 to 10.

Return ONLY valid JSON in this exact format:
{
  "score": 0,
  "feedback": "Short and specific feedback"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      const text = response.text?.trim();

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const cleanedText = text
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const evaluation = JSON.parse(cleanedText);

      const score = Number(evaluation.score);
      const feedback = String(evaluation.feedback);

      if (!Number.isFinite(score) || score < 0 || score > 10 || !feedback) {
        throw new Error("Invalid evaluation returned by Gemini.");
      }

      const updatedAnswer = await prisma.interviewAnswer.update({
        where: {
          id: answer.id,
        },
        data: {
          score,
          feedback,
        },
      });

      results.push(updatedAnswer);
    }

    return NextResponse.json({
      success: true,
      message: "Interview evaluated successfully",
      data: results,
    });
  } catch (error) {
    console.error("Interview evaluation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to evaluate interview",
      },
      { status: 500 },
    );
  }
}
