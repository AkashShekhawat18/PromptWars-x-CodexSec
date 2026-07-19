import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";
import { z } from "zod";
import { saveToBrain } from "@/lib/second-brain";

const taskSchema = z.object({
  title: z.string().min(1).max(255),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional().default("MEDIUM"),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional().default("TODO"),
});

export async function GET() {
  try {
    const user = await requireAuthUser();
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(tasks);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuthUser();
    
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const result = taskSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: result.error.issues[0]?.message || "Invalid task data" }, { status: 400 });
    }

    const { title, priority, status } = result.data;

    const task = await prisma.task.create({
      data: {
        title,
        priority,
        status,
        userId: user.id,
      },
    });

    // Save to Second Brain in background
    saveToBrain(user.id, "TASK", `Task created: ${title}\nPriority: ${priority || 'MEDIUM'}`, task.id).catch(console.error);

    return Response.json(task);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[Tasks POST]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
