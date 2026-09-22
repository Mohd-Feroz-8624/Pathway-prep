import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    await prisma.resumeTemplate.delete({
      where: {
        id: "",
      },
    });

    const template = await prisma.resumeTemplate.create({
      data: {
        name: "Classic",
        slug: "classic",
        description: "A classic professional resume template",
        isPublished: true,
      },
    });

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Classic template repair error:", error);

    return NextResponse.json(
      { error: "Classic template repair failed." },
      { status: 500 },
    );
  }
}
