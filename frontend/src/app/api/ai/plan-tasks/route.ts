import { planTasks } from "@/lib/gemini";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";

const MAX_GOAL_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    // Limit request body size
    const bodySize = parseInt(req.headers.get("content-length") || "0", 10);
    if (bodySize > 1024 * 100) { // 100KB limit
      return Response.json({ error: "Request body too large" }, { status: 413 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { goal } = body;

    if (!goal || typeof goal !== "string") {
      return Response.json({ error: "Goal string is required" }, { status: 400 });
    }

    if (goal.length > MAX_GOAL_LENGTH) {
      return Response.json({ error: "Goal exceeds maximum length" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return Response.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    const generatedTasks = await planTasks(goal);

    // Filter/validate generated tasks before inserting to DB
    const validTasks = generatedTasks.filter(t => 
      t.title && typeof t.title === 'string'
    ).map(t => ({
      title: String(t.title).substring(0, 255),
      description: t.description ? String(t.description).substring(0, 1000) : null,
      priority: ["LOW", "MEDIUM", "HIGH", "URGENT"].includes(t.priority as string) ? t.priority : "MEDIUM",
      status: "TODO",
      userId: user.id
    }));

    if (validTasks.length === 0) {
      return Response.json({ tasks: [] });
    }

    // Save tasks inside a transaction
    const savedTasks = await prisma.$transaction(
      validTasks.map(task => prisma.task.create({ data: task }))
    );

    return Response.json({ tasks: savedTasks });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[AI Plan Tasks Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
