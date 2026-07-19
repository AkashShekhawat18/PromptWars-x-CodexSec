import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";

export async function GET() {
  try {
    const user = await requireAuthUser();
    const chats = await prisma.aIChat.findMany({
      where: { userId: user.id },
      include: { messages: true },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(chats);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[Chat History Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
