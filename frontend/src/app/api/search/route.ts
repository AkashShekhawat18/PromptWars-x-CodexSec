import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthUser } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return Response.json({ results: [] });
    }

    const results = [];

    // Search Tasks
    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        OR: [
          { title: { contains: query } },
          { description: { contains: query } }
        ]
      },
      take: 5,
    });
    results.push(...tasks.map(t => ({
      id: `task-${t.id}`,
      type: "Task",
      title: t.title,
      subtitle: t.status,
      href: `/dashboard`,
      icon: "CheckCircle"
    })));

    // Search Documents
    const documents = await prisma.document.findMany({
      where: {
        userId: user.id,
        originalName: { contains: query }
      },
      take: 5,
    });
    results.push(...documents.map(d => ({
      id: `doc-${d.id}`,
      type: "Document",
      title: d.originalName,
      subtitle: `${(d.size / 1024 / 1024).toFixed(2)} MB`,
      href: `/dashboard/vault`,
      icon: "FileText"
    })));

    // Search Workflows
    const workflows = await prisma.workflow.findMany({
      where: {
        userId: user.id,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } }
        ]
      },
      take: 5,
    });
    results.push(...workflows.map(w => ({
      id: `wf-${w.id}`,
      type: "Workflow",
      title: w.name,
      subtitle: w.description || "Automated workflow",
      href: `/dashboard/workflows`,
      icon: "Workflow"
    })));

    // Search Chats
    const chats = await prisma.aIChat.findMany({
      where: {
        userId: user.id,
        title: { contains: query }
      },
      take: 5,
    });
    results.push(...chats.map(c => ({
      id: `chat-${c.id}`,
      type: "Chat",
      title: c.title || "Untitled Chat",
      subtitle: "AI Conversation",
      href: `/dashboard/chat`,
      icon: "MessageSquare"
    })));

    return Response.json({ results });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[Search Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
