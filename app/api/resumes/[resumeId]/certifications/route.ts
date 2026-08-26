import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type CertificationRouteProps = {
  params: Promise<{
    resumeId: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: CertificationRouteProps,
) {
  try {
    // 1. Authenticate with Clerk
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find database user
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Get resume ID
    const { resumeId } = await params;

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 },
      );
    }

    // 4. Verify resume ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // 5. Read request body
    const body = await request.json();

    // 6. Validate required field
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Certification name is required" },
        { status: 400 },
      );
    }

    // 7. Create certification
    const certification = await prisma.resumeCertification.create({
      data: {
        resumeId: resume.id,

        name: body.name.trim(),

        issuer:
          typeof body.issuer === "string" && body.issuer.trim()
            ? body.issuer.trim()
            : null,

        issueDate:
          typeof body.issueDate === "string" && body.issueDate.trim()
            ? body.issueDate.trim()
            : null,

        credentialUrl:
          typeof body.credentialUrl === "string" && body.credentialUrl.trim()
            ? body.credentialUrl.trim()
            : null,
      },
    });

    // 8. Return created certification
    return NextResponse.json(
      {
        success: true,
        message: "Certification added successfully",
        data: certification,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create certification error:", error);

    return NextResponse.json(
      { error: "Failed to add certification" },
      { status: 500 },
    );
  }
}
