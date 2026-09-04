import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ContactReportType } from "@/app/generated/prisma/client";

const validTypes = [
  "MISSING_SUBJECT",
  "CONTENT_ISSUE",
  "TECHNICAL_ISSUE",
  "ROADMAP_ISSUE",
  "FEATURE_REQUEST",
  "OTHER",
] as const;

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find the user in our database
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

    // 3. Read request body
    const body = await request.json();

    const { type, subject, message } = body;

    // 4. Validate issue type
    if (
      typeof type !== "string" ||
      !validTypes.includes(type as (typeof validTypes)[number])
    ) {
      return NextResponse.json(
        { error: "Invalid issue type." },
        { status: 400 },
      );
    }

    // 5. Validate message
    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Description is required." },
        { status: 400 },
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide at least 10 characters." },
        { status: 400 },
      );
    }

    // 6. Create the report
    const report = await prisma.contactReport.create({
      data: {
        userId: user.id,
        type: type as ContactReportType,
        subject:
          typeof subject === "string" && subject.trim() ? subject.trim() : null,
        message: message.trim(),
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    // 7. Return success
    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Contact report error:", error);

    return NextResponse.json(
      {
        error: "Failed to submit your report.",
      },
      { status: 500 },
    );
  }
}
