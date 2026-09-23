import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const allowedRoles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "SDE",
];

const allowedMimeTypes = ["application/pdf", "image/jpeg", "image/png"];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // 2. Read uploaded form data
    const formData = await request.formData();

    const file = formData.get("file");
    const targetRole = formData.get("targetRole");

    // 3. Validate file
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Resume file is required." },
        { status: 400 },
      );
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Only PDF, JPG, and PNG files are supported.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Resume file must be 10 MB or smaller.",
        },
        { status: 400 },
      );
    }

    // 4. Validate target role
    if (typeof targetRole !== "string" || !allowedRoles.includes(targetRole)) {
      return NextResponse.json(
        { error: "Please select a valid target role." },
        { status: 400 },
      );
    }

    // 5. Convert file to base64
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const base64File = fileBuffer.toString("base64");

    // 6. Prepare AI prompt
    const prompt = `
You are an expert ATS resume evaluator and technical recruiter.

Analyze the uploaded resume for this target role:

TARGET ROLE:
${targetRole}

Evaluate the actual resume carefully.

Give scores from 0 to 100 for:

- Overall ATS compatibility
- Resume completeness
- Keyword relevance
- Experience relevance
- ATS-friendly structure
- Impact of achievements/projects
- Readability

Also identify:

- Strengths
- Weaknesses
- Missing keywords
- Specific recommendations for improvement

Do not invent information that is not present in the resume.

Return ONLY valid JSON in exactly this format:

{
  "overallScore": 0,
  "completenessScore": 0,
  "keywordScore": 0,
  "experienceScore": 0,
  "atsStructureScore": 0,
  "impactScore": 0,
  "readabilityScore": 0,
  "strengths": "Short specific summary",
  "weaknesses": "Short specific summary",
  "missingKeywords": "Comma-separated keywords",
  "recommendations": "Specific actionable recommendations"
}

All scores must be integers between 0 and 100.
Do not use markdown.
Do not use code fences.
`;

    // 7. Send resume to Gemini
    let response;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
                {
                  inlineData: {
                    mimeType: file.type,
                    data: base64File,
                  },
                },
              ],
            },
          ],
        });

        break;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        const isTemporaryError =
          errorMessage.includes("503") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("high demand");

        if (!isTemporaryError || attempt === 3) {
          throw error;
        }

        const delay = attempt * 2000;

        console.log(
          `Gemini temporarily unavailable. Retrying in ${delay}ms...`,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!response) {
      throw new Error("Gemini analysis failed after multiple attempts.");
    }

    const text = response.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    // 8. Remove accidental code fences
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // 9. Parse AI response
    let analysis: Record<string, unknown>;

    try {
      analysis = JSON.parse(cleanedText);
    } catch {
      console.error("Invalid Gemini response:", cleanedText);

      throw new Error("Gemini returned an invalid analysis response.");
    }

    // 10. Validate scores
    const scoreFields = [
      "overallScore",
      "completenessScore",
      "keywordScore",
      "experienceScore",
      "atsStructureScore",
      "impactScore",
      "readabilityScore",
    ];

    for (const field of scoreFields) {
      const score = Number(analysis[field]);

      if (!Number.isInteger(score) || score < 0 || score > 100) {
        throw new Error(`Invalid ${field} returned by Gemini.`);
      }
    }
    const uploadedResume = await prisma.uploadedResume.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileType: file.type,
      },
    });
    const savedAnalysis = await prisma.resumeAnalysis.create({
      data: {
        uploadedResumeId: uploadedResume.id,
        targetRole,

        overallScore: Number(analysis.overallScore),
        completenessScore: Number(analysis.completenessScore),
        keywordScore: Number(analysis.keywordScore),
        experienceScore: Number(analysis.experienceScore),
        atsStructureScore: Number(analysis.atsStructureScore),
        impactScore: Number(analysis.impactScore),
        readabilityScore: Number(analysis.readabilityScore),

        strengths:
          typeof analysis.strengths === "string" ? analysis.strengths : null,

        weaknesses:
          typeof analysis.weaknesses === "string" ? analysis.weaknesses : null,

        missingKeywords:
          typeof analysis.missingKeywords === "string"
            ? analysis.missingKeywords
            : null,

        recommendations:
          typeof analysis.recommendations === "string"
            ? analysis.recommendations
            : null,
      },
    });

    // 11. Return analysis
    return NextResponse.json({
      success: true,
      message: "Resume analyzed successfully.",
      data: {
        analysisId: savedAnalysis.id,
        uploadedResumeId: uploadedResume.id,
        fileName: file.name,
        targetRole,

        overallScore: Number(analysis.overallScore),
        completenessScore: Number(analysis.completenessScore),
        keywordScore: Number(analysis.keywordScore),
        experienceScore: Number(analysis.experienceScore),
        atsStructureScore: Number(analysis.atsStructureScore),
        impactScore: Number(analysis.impactScore),
        readabilityScore: Number(analysis.readabilityScore),

        strengths: savedAnalysis.strengths ?? "",
        weaknesses: savedAnalysis.weaknesses ?? "",
        missingKeywords: savedAnalysis.missingKeywords ?? "",
        recommendations: savedAnalysis.recommendations ?? "",
      },
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze resume.",
      },
      { status: 500 },
    );
  }
}
