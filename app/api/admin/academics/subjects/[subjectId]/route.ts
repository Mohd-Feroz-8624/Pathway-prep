import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

type RouteContext = {
  params: Promise<{
    subjectId: string;
  }>;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { subjectId } = await params;
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const code =
      typeof body.code === "string" && body.code.trim()
        ? body.code.trim().toUpperCase()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Subject name is required." },
        { status: 400 },
      );
    }

    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found." },
        { status: 404 },
      );
    }

    const slug = createSlug(name);

    const duplicate = await prisma.subject.findFirst({
      where: {
        semesterId: subject.semesterId,
        name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          id: subjectId,
        },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error: "A subject with this name already exists in this semester.",
        },
        { status: 409 },
      );
    }

    const existingSlug = await prisma.subject.findFirst({
      where: {
        semesterId: subject.semesterId,
        slug,
        NOT: {
          id: subjectId,
        },
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          error:
            "A subject with a similar name already exists in this semester.",
        },
        { status: 409 },
      );
    }

    const updatedSubject = await prisma.subject.update({
      where: {
        id: subjectId,
      },
      data: {
        name,
        code,
        slug,
      },
    });

    return NextResponse.json({
      success: true,
      subject: updatedSubject,
    });
  } catch (error) {
    console.error("Admin subject update error:", error);

    return NextResponse.json(
      { error: "Failed to update subject." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    await requireAdmin();

    const { subjectId } = await params;

    const subject = await prisma.subject.findUnique({
      where: {
        id: subjectId,
      },
      include: {
        units: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "Subject not found." },
        { status: 404 },
      );
    }

    await prisma.subject.delete({
      where: {
        id: subjectId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    console.error("Admin subject deletion error:", error);

    return NextResponse.json(
      { error: "Failed to delete subject." },
      { status: 500 },
    );
  }
}
