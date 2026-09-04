import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const semesterId =
      typeof body.semesterId === "string" ? body.semesterId.trim() : "";

    const subjectId =
      typeof body.subjectId === "string" ? body.subjectId.trim() : "";

    const number =
      typeof body.number === "number" ? body.number : Number(body.number);

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;

    if (!semesterId) {
      return NextResponse.json(
        { error: "Semester is required." },
        { status: 400 },
      );
    }

    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(number) || number <= 0) {
      return NextResponse.json(
        { error: "Unit number must be a positive integer." },
        { status: 400 },
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Unit title is required." },
        { status: 400 },
      );
    }

    const subject = await prisma.subject.findFirst({
      where: {
        id: subjectId,
        semesterId,
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found." },
        { status: 404 },
      );
    }

    const existingUnit = await prisma.unit.findFirst({
      where: {
        subjectId,
        number,
      },
    });

    if (existingUnit) {
      return NextResponse.json(
        {
          error: `Unit ${number} already exists in this subject.`,
        },
        { status: 409 },
      );
    }

    const unit = await prisma.unit.create({
      data: {
        number,
        title,
        description,
        subjectId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        unit,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin unit creation error:", error);

    return NextResponse.json(
      { error: "Failed to create unit." },
      { status: 500 },
    );
  }
}
