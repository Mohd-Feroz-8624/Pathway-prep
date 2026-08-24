import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const roadmaps = await prisma.roadmap.findMany({
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
