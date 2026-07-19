import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";

export async function GET() {
  try {
    const user = await requireAuthUser();

    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const formattedDocs = documents.map(doc => ({
      id: doc.id,
      name: doc.originalName,
      type: doc.mimeType === "application/pdf" ? "pdf" : "docx",
      size: `${(doc.size / 1024 / 1024).toFixed(1)} MB`,
      uploadDate: doc.createdAt.toISOString(),
      url: doc.url,
      status: doc.status
    }));

    return Response.json(formattedDocs);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[Get Documents Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
