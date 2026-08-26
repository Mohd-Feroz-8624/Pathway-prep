import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function POST() {
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

    // 2. Find the database user
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

    // 3. Create resume
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: "My Resume",
      },
    });

    // 4. Return created resume
    return NextResponse.json(
      {
        success: true,
        message: "Resume created successfully",
        data: resume,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create resume error:", error);

    return NextResponse.json(
      {
        error: "Failed to create resume",
      },
      { status: 500 },
    );
  }
}
