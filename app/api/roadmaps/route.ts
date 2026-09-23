import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const roadmaps = await prisma.roadmap.findMany({
      where: {
        isPublished: true,
      },
      include: {
        stages: {
          orderBy: {
            order: "asc",
          },
          include: {
            tasks: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: roadmaps,
    });
  } catch (error) {
    console.error("Failed to fetch roadmaps:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch roadmaps",
      },
      {
        status: 500,
      },
    );
  }
}
