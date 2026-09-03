import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const template = await prisma.resumeTemplate.upsert({
      where: {
        slug: "modern",
      },
      update: {
        name: "Modern",
        description: "Modern professional resume template",
        isPublished: true,
      },
      create: {
        name: "Modern",
        slug: "modern",
        description: "Modern professional resume template",
        isPublished: true,
      },
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Create template error:", error);

    return NextResponse.json(
      {
        error: "Failed to create template",
      },
      { status: 500 },
    );
  }
}
