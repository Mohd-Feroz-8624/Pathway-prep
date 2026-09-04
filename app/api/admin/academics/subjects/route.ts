import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const semesterId =
      typeof body.semesterId === "string" ? body.semesterId.trim() : "";

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const code =
      typeof body.code === "string" && body.code.trim()
        ? body.code.trim().toUpperCase()
        : null;

    if (!semesterId) {
      return NextResponse.json(
        { error: "Semester is required." },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Subject name is required." },
        { status: 400 },
      );
    }

    const semester = await prisma.semester.findUnique({
      where: {
        id: semesterId,
      },
    });

    if (!semester) {
      return NextResponse.json(
        { error: "Semester not found." },
        { status: 404 },
      );
    }

    const existingSubject = await prisma.subject.findFirst({
      where: {
        semesterId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: "A subject with this name already exists in this semester." },
        { status: 409 },
      );
    }

   const slug = name
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const subject = await prisma.subject.create({
  data: {
    semesterId,
    name,
    code,
    slug,
  },
});

    return NextResponse.json(
      {
        success: true,
        subject,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin subject creation error:", error);

    return NextResponse.json(
      { error: "Failed to create subject." },
      { status: 500 },
    );
  }
}
