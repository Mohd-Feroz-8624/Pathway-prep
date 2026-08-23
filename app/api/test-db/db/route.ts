import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw<Array<{ now: Date }>>`SELECT now();`;

    return NextResponse.json({
      ok: true,
      dbTime: result[0]?.now ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Database query failed",
      },
      { status: 500 },
    );
  }
}
