import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

type CertificationRouteProps = {
  params: Promise<{
    resumeId: string;
    certificationId: string;
  }>;
};

async function getOwnedCertification(
  resumeId: string,
  certificationId: string,
  clerkId: string,
) {
  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  if (!user) {
    return {
      error: "User not found",
      status: 404,
    };
  }

  const certification = await prisma.resumeCertification.findFirst({
    where: {
      id: certificationId,
      resumeId,
      resume: {
        userId: user.id,
      },
    },
  });

  if (!certification) {
    return {
      error: "Certification not found",
      status: 404,
    };
  }

  return { certification };
}

export async function PATCH(
  request: Request,
  { params }: CertificationRouteProps,
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, certificationId } = await params;

    if (!resumeId || !certificationId) {
      return NextResponse.json(
        {
          error: "Resume ID and certification ID are required",
        },
        { status: 400 },
      );
    }

    const result = await getOwnedCertification(
      resumeId,
      certificationId,
      clerkId,
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const body = await request.json();

    if (
      body.name !== undefined &&
      (typeof body.name !== "string" || !body.name.trim())
    ) {
      return NextResponse.json(
        {
          error: "Certification name cannot be empty",
        },
        { status: 400 },
      );
    }

    const certification = await prisma.resumeCertification.update({
      where: {
        id: certificationId,
      },
      data: {
        name: body.name !== undefined ? body.name.trim() : undefined,

        issuer:
          body.issuer !== undefined ? body.issuer?.trim() || null : undefined,

        issueDate:
          body.issueDate !== undefined
            ? body.issueDate?.trim() || null
            : undefined,

        credentialUrl:
          body.credentialUrl !== undefined
            ? body.credentialUrl?.trim() || null
            : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Certification updated successfully",
      data: certification,
    });
  } catch (error) {
    console.error("Update certification error:", error);

    return NextResponse.json(
      {
        error: "Failed to update certification",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: CertificationRouteProps,
) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, certificationId } = await params;

    if (!resumeId || !certificationId) {
      return NextResponse.json(
        {
          error: "Resume ID and certification ID are required",
        },
        { status: 400 },
      );
    }

    const result = await getOwnedCertification(
      resumeId,
      certificationId,
      clerkId,
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    await prisma.resumeCertification.delete({
      where: {
        id: certificationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Certification deleted successfully",
    });
  } catch (error) {
    console.error("Delete certification error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete certification",
      },
      { status: 500 },
    );
  }
}
