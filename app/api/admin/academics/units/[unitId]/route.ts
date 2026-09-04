import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type RouteContext = {
  params: Promise<{
    unitId: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { unitId } = await params;
    const body = await request.json();

    const number =
      typeof body.number === "number" ? body.number : Number(body.number);

    const title = typeof body.title === "string" ? body.title.trim() : "";

    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;

    const difficulty =
      typeof body.difficulty === "string" && body.difficulty.trim()
        ? body.difficulty.trim()
        : null;

    const duration =
      typeof body.duration === "string" && body.duration.trim()
        ? body.duration.trim()
        : null;

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

    const unit = await prisma.unit.findUnique({
      where: {
        id: unitId,
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found." }, { status: 404 });
    }

    const duplicate = await prisma.unit.findFirst({
      where: {
        subjectId: unit.subjectId,
        number,
        NOT: {
          id: unitId,
        },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error: `Unit ${number} already exists in this subject.`,
        },
        { status: 409 },
      );
    }

    const updatedUnit = await prisma.unit.update({
      where: {
        id: unitId,
      },
      data: {
        number,
        title,
        description,
        difficulty,
        duration,
      },
    });

    return NextResponse.json({
      success: true,
      unit: updatedUnit,
    });
  } catch (error) {
    console.error("Admin unit update error:", error);

    return NextResponse.json(
      { error: "Failed to update unit." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { unitId } = await params;

    const unit = await prisma.unit.findUnique({
      where: {
        id: unitId,
      },
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found." }, { status: 404 });
    }

    await prisma.unit.delete({
      where: {
        id: unitId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Unit deleted successfully.",
    });
  } catch (error) {
    console.error("Admin unit deletion error:", error);

    return NextResponse.json(
      { error: "Failed to delete unit." },
      { status: 500 },
    );
  }
}
