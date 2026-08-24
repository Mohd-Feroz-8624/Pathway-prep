import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    // 1. Get authenticated Clerk user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // 2. Read request body
    const body = await request.json();

    const {
      name,
      college,
      branch,
      currentSemester,
      careerGoal,
      github,
      linkedin,
    } = body;

    // 3. Validate semester
    let semester: number | null = null;

    if (currentSemester !== undefined && currentSemester !== "") {
      const parsedSemester = Number(currentSemester);

      if (
        !Number.isInteger(parsedSemester) ||
        parsedSemester < 1 ||
        parsedSemester > 8
      ) {
        return NextResponse.json(
          {
            error: "Current semester must be between 1 and 8",
          },
          {
            status: 400,
          },
        );
      }

      semester = parsedSemester;
    }

    // 4. Find the database user using Clerk ID
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
        {
          status: 404,
        },
      );
    }

    // 5. Update User model
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name?.trim() || null,
        college: college?.trim() || null,
        branch: branch?.trim() || null,
        currentSemester: semester,
        careerGoal: careerGoal?.trim() || null,
      },
    });

    // 6. Update or create Profile model
    await prisma.profile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        github: github?.trim() || null,
        linkedin: linkedin?.trim() || null,
      },
      create: {
        userId: user.id,
        github: github?.trim() || null,
        linkedin: linkedin?.trim() || null,
      },
    });

    // 7. Return success
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      {
        error: "Failed to update profile",
      },
      {
        status: 500,
      },
    );
  }
}