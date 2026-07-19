import { NextRequest } from "next/server";
import { requireAuthUser } from "@/lib/api-auth";
import { searchBrain } from "@/lib/second-brain";
import { searchKnowledge } from "@/lib/gemini";
import { saveToBrain } from "@/lib/second-brain";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { query } = body;
    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query string is required" }, { status: 400 });
    }

    // Search Second Brain
    const searchResults = await searchBrain(user.id, query, 10, 0.5);
    
    const context = searchResults.map(r => `[${r.nodeType} - ${new Date(r.createdAt).toLocaleDateString()}]: ${r.content}`).join("\n\n");

    // We can use the existing searchKnowledge from gemini.ts which takes context and answers based on it
    const aiResponse = await searchKnowledge(query, context);

    // Optionally save this interaction to Second Brain as well
    saveToBrain(user.id, "CHAT", `Second Brain Query: ${query}\nAnswer: ${aiResponse.answer}`).catch(console.error);

    return Response.json({
      answer: aiResponse.answer,
      sources: searchResults.map(r => ({
        id: r.id,
        type: r.nodeType,
        content: r.content,
        similarity: r.similarity
      }))
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[SecondBrain Ask Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
