import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    // Fetch recent items
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const workflows = await prisma.workflow.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const chats = await prisma.aIChat.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    // Combine and sort
    const activities = [
      ...tasks.map(t => ({
        id: `task-${t.id}`,
        type: 'Task created',
        title: t.title,
        date: t.createdAt,
        icon: 'CheckCircle'
      })),
      ...documents.map(d => ({
        id: `doc-${d.id}`,
        type: 'Document uploaded',
        title: d.originalName,
        date: d.createdAt,
        icon: 'FileText'
      })),
      ...workflows.map(w => ({
        id: `wf-${w.id}`,
        type: 'Workflow generated',
        title: w.name,
        date: w.createdAt,
        icon: 'Workflow'
      })),
      ...chats.map(c => ({
        id: `chat-${c.id}`,
        type: 'Chat started',
        title: c.title || 'Untitled Chat',
        date: c.createdAt,
        icon: 'MessageSquare'
      }))
    ];

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Return top 8
    return Response.json({ activities: activities.slice(0, 8) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[Activity Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
