import { summarizeDocument } from "@/lib/gemini";
import { NextRequest } from "next/server";
import { requireAuthUser } from "@/lib/api-auth";
import { saveToBrain } from "@/lib/second-brain";

const MAX_CONTENT_LENGTH = 100000; // 100k characters (~20k words)

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser();

    // Limit request body size to ~500KB to prevent memory exhaustion
    const bodySize = parseInt(req.headers.get("content-length") || "0", 10);
    if (bodySize > 1024 * 500) { 
      return Response.json({ error: "Request body too large" }, { status: 413 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { content } = body;

    if (!content || typeof content !== "string") {
      return Response.json({ error: "Content string is required" }, { status: 400 });
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return Response.json({ error: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters` }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return Response.json({ error: "Gemini API key is not configured." }, { status: 500 });
    }

    const result = await summarizeDocument(content);
    
    // Save insight to Second Brain
    saveToBrain(user.id, "DOC_INSIGHT", `Document Summary:\n${result.summary}\n\nKey Points:\n${result.keyPoints.join('\n')}`).catch(console.error);

    return Response.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[AI Summarize Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
