import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { resourceCreateSchema } from "@/lib/validations/resource";
import { prisma } from "@/lib/prisma";

type ResourceRouteProps = {
  params: Promise<{
    resourceId: string;
  }>;
};

export async function DELETE(request: Request, { params }: ResourceRouteProps) {
  try {
    // 1. Authenticate user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Find database user
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

    // 4. Get resource ID
    const { resourceId } = await params;

    if (!resourceId) {
      return NextResponse.json(
        {
          error: "Resource ID is required",
        },
        { status: 400 },
      );
    }

    // 5. Check resource exists
    const resource = await prisma.unitResource.findUnique({
      where: {
        id: resourceId,
      },
    });

    if (!resource) {
      return NextResponse.json(
        {
          error: "Resource not found",
        },
        { status: 404 },
      );
    }

    // 6. Delete resource
    await prisma.unitResource.delete({
      where: {
        id: resourceId,
      },
    });

    // 7. Return success
    return NextResponse.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete resource error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete resource",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: ResourceRouteProps) {
  try {
    // 1. Authenticate user
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    // 2. Find database user
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

    // 4. Get resource ID
    const { resourceId } = await params;

    if (!resourceId) {
      return NextResponse.json(
        {
          error: "Resource ID is required",
        },
        { status: 400 },
      );
    }

    // 5. Verify resource exists
    const existingResource = await prisma.unitResource.findUnique({
      where: {
        id: resourceId,
      },
    });

    if (!existingResource) {
      return NextResponse.json(
        {
          error: "Resource not found",
        },
        { status: 404 },
      );
    }

    // 6. Read request body
    const body = await request.json();

    // 7. Validate request
  const result = resourceCreateSchema.safeParse({
    unitId: existingResource.unitId,
    type: body.type,
    title: body.title,
    description: body.description,
    url: body.url,
  });

    if (!result.success) {
      console.error(
        "Resource validation error:",
        result.error.flatten().fieldErrors,
      );

      return NextResponse.json(
        {
          error: "Invalid resource data",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { type, title, description, url } = result.data;

    // 8. Update resource
    const resource = await prisma.unitResource.update({
      where: {
        id: resourceId,
      },
      data: {
        type,
        title,
        description: description || null,
        url,
      },
    });

    // 9. Return updated resource
    return NextResponse.json({
      success: true,
      message: "Resource updated successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Update resource error:", error);

    return NextResponse.json(
      {
        error: "Failed to update resource",
      },
      { status: 500 },
    );
  }
}