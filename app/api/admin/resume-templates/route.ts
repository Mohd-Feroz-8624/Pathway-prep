import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import {DEFAULT_TEMPLATE_CONFIG} from "@/lib/resume-template-config";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        role: true,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const slug =
      typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";

    const description =
      typeof body.description === "string" ? body.description.trim() : "";

    const previewUrl =
      typeof body.previewUrl === "string" ? body.previewUrl.trim() : "";

    const headerAlignment =
      typeof body.headerAlignment === "string"
        ? body.headerAlignment
        : "CENTER";

    const layout = typeof body.layout === "string" ? body.layout : "ONE_COLUMN";

    const accentColor =
      typeof body.accentColor === "string" ? body.accentColor : "BLACK";

    const sectionStyle =
      typeof body.sectionStyle === "string" ? body.sectionStyle : "SIMPLE";

    const nameSize =
      typeof body.nameSize === "string" ? body.nameSize : "LARGE";

    const isPublished =
      typeof body.isPublished === "boolean" ? body.isPublished : false;

    if (!name) {
      return NextResponse.json(
        { error: "Template name is required." },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Template slug is required." },
        { status: 400 },
      );
    }

    const existingTemplate = await prisma.resumeTemplate.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingTemplate) {
      return NextResponse.json(
        { error: "A template with this slug already exists." },
        { status: 409 },
      );
    }

    const template = await prisma.resumeTemplate.create({
      data: {
        name,
        slug,
        description: description || null,
        previewUrl: previewUrl || null,
        headerAlignment,
        layout,
        accentColor,
        sectionStyle,
        nameSize,
        designConfig: DEFAULT_TEMPLATE_CONFIG,
        isPublished,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        previewUrl: true,
        headerAlignment: true,
        layout: true,
        accentColor: true,
        sectionStyle: true,
        nameSize: true,
        isPublished: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Admin resume template creation error:", error);

    return NextResponse.json(
      { error: "Failed to create resume template." },
      { status: 500 },
    );
  }
}
