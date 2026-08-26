import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { resourceCreateSchema } from "@/lib/validations/resource";

export async function POST(request: Request) {
  try {
    // 1. Authenticate with Clerk
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Find the database user
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
        { status: 404 },
      );
    }

    // 3. Check admin role
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Forbidden",
        },
        { status: 403 },
      );
    }

    // 4. Read request body
    const body = await request.json();

    // 5. Validate request body
    const result = resourceCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid resource data",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { unitId, type, title, description, url } = result.data;

    // 6. Verify the unit exists
    const unit = await prisma.unit.findUnique({
      where: {
        id: unitId,
      },
    });

    if (!unit) {
      return NextResponse.json(
        {
          error: "Unit not found",
        },
        { status: 404 },
      );
    }

    // 7. Create resource
    const resource = await prisma.unitResource.create({
      data: {
        unitId,
        type,
        title,
        description: description || null,
        url,
      },
    });

    // 8. Return created resource
    return NextResponse.json(
      {
        success: true,
        message: "Resource created successfully",
        data: resource,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create resource error:", error);

    return NextResponse.json(
      {
        error: "Failed to create resource",
      },
      { status: 500 },
    );
  }
}

