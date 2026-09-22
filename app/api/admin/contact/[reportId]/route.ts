import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { ContactReportStatus } from "@/app/generated/prisma/client";

const validStatuses = [
  ContactReportStatus.PENDING,
  ContactReportStatus.IN_PROGRESS,
  ContactReportStatus.RESOLVED,
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    // 1. Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Verify admin
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

    // 3. Get report ID
    const { reportId } = await params;

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required." },
        { status: 400 },
      );
    }

    // 4. Read request body
    const body = await request.json();
    const { status } = body;

    // 5. Validate status
    if (
      typeof status !== "string" ||
      !validStatuses.includes(status as ContactReportStatus)
    ) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    // 6. Update report
    const report = await prisma.contactReport.update({
      where: {
        id: reportId,
      },
      data: {
        status: status as ContactReportStatus,
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    // 7. Return updated report
    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Contact report status update error:", error);

    return NextResponse.json(
      { error: "Failed to update report status." },
      { status: 500 },
    );
  }
}
