import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";
import { generateExecutiveBrief } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    // 1. Gather live stats
    const tasksCount = await prisma.task.count({
      where: { userId: user.id, status: { not: "COMPLETED" } },
    });

    const meetingsCount = await prisma.task.count({
      where: {
        userId: user.id,
        status: { not: "COMPLETED" },
        OR: [
          { title: { contains: "meeting" } },
          { title: { contains: "call" } },
          { title: { contains: "sync" } },
        ],
      },
    });

    const docsCount = await prisma.document.count({
      where: { userId: user.id },
    });

    // 2. Generate brief via AI
    let recommendation = "Focus on your top priority tasks.";
    let focusTime = "2h 30m";
    let suggestedActions: string[] = ["Plan today's schedule", "Organize tasks"];
    
    // Fallback if Gemini key is missing
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      recommendation = tasksCount > 0 ? "You have pending tasks to complete." : "You're all caught up! Consider reviewing your knowledge vault.";
      suggestedActions = ["Plan today's schedule", "Review recent documents"];
    } else {
      const brief = await generateExecutiveBrief(user.name || "User", tasksCount, meetingsCount, docsCount);
      recommendation = brief.recommendation;
      focusTime = brief.focusTime;
      suggestedActions = brief.suggestedActions;
    }

    return Response.json({
      greeting: `Good Afternoon 👋`, // We can make this dynamic based on time
      tasksCount,
      meetingsCount,
      docsCount,
      recommendation,
      focusTime,
      suggestedActions,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[Executive Brief Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
