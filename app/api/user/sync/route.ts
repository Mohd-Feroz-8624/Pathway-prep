import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { name, email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: {
        clerkId,
      },
      update: {
        name: name || undefined,
        email,
      },
      create: {
        clerkId,
        name: name || null,
        email,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("User sync error:", error);

    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
