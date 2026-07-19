import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.adminActionLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          admin: {
            select: { id: true, name: true, email: true }
          }
        }
      }),
      prisma.adminActionLog.count()
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Admin audit GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
