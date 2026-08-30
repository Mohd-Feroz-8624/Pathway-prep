import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
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
        result: true,
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
        { error: "No interview answers found" },
        { status: 400 },
      );
    }

    const unanswered = session.answers.filter(
      (answer) => answer.score === null,
    );

    if (unanswered.length > 0) {
      return NextResponse.json(
        {
          error: "Some answers have not been evaluated yet",
        },
        { status: 400 },
      );
    }

    const totalScore = session.answers.reduce(
      (total, answer) => total + (answer.score ?? 0),
      0,
    );

    const overallScore = Math.round((totalScore / session.answers.length) * 10);

    const answerSummary = session.answers
      .map(
        (answer, index) => `
Question ${index + 1}:
${answer.question.question}

Candidate Answer:
${answer.answer}

Score:
${answer.score}/10

Feedback:
${answer.feedback}
`,
      )
      .join("\n");

    const prompt = `
You are an expert interview evaluator.

Analyze the candidate's complete technical interview.

Interview Role:
${session.role}

Difficulty:
${session.difficulty}

Interview Type:
${session.type}

Interview Answers:
${answerSummary}

Provide an overall assessment.

Return ONLY valid JSON in this exact format:

{
  "strengths": "A concise summary of the candidate's strongest areas.",
  "weaknesses": "A concise summary of the areas that need improvement.",
  "recommendations": "Specific recommendations for improving interview performance."
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

    const analysis = JSON.parse(cleanedText);

    const strengths = String(analysis.strengths);
    const weaknesses = String(analysis.weaknesses);
    const recommendations = String(analysis.recommendations);
    const result = await prisma.interviewResult.upsert({
      where: {
        sessionId,
      },
      update: {
        overallScore,
        strengths: strengths || null,
        weaknesses: weaknesses || null,
        recommendations: recommendations || null,
      },
      create: {
        sessionId,
        overallScore,
        strengths: strengths || null,
        weaknesses: weaknesses || null,
        recommendations: recommendations || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Interview result created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Create interview result error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create interview result",
      },
      { status: 500 },
    );
  }
}
