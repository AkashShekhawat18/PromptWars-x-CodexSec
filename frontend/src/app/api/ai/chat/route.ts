import { streamChat } from "@/lib/gemini";
import { NextRequest } from "next/server";
import { requireAuthUser } from "@/lib/api-auth";
import { saveToBrain } from "@/lib/second-brain";

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(req: NextRequest) {
  try {
    await requireAuthUser();

    // Limit request body size
    const bodySize = parseInt(req.headers.get("content-length") || "0", 10);
    if (bodySize > 1024 * 1024) { // 1MB limit for chat
      return Response.json({ error: "Request body too large" }, { status: 413 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { messages, systemPrompt } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages array is required" }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return Response.json({ error: "Too many messages in history" }, { status: 400 });
    }

    // Input sanitization/validation
    for (const msg of messages) {
      if (typeof msg.content !== "string" || typeof msg.role !== "string") {
        return Response.json({ error: "Invalid message format" }, { status: 400 });
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return Response.json({ error: "Message exceeds maximum length" }, { status: 400 });
      }
    }

    if (systemPrompt && typeof systemPrompt !== "string") {
       return Response.json({ error: "systemPrompt must be a string" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return Response.json(
        { error: "Gemini API key is not configured. Please add your key to frontend/.env.local" },
        { status: 500 }
      );
    }

    const stream = await streamChat(messages, systemPrompt);

    // Save the user's latest query to Second Brain
    const userMessage = messages.filter((m: any) => m.role === "user").pop();
    if (userMessage && userMessage.content) {
      saveToBrain(user.id, "CHAT", `Chat query: ${userMessage.content}`).catch(console.error);
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg === "UNAUTHORIZED" || msg === "SUSPENDED") {
      return Response.json({ error: msg }, { status: 401 });
    }
    console.error("[AI Chat Error]", msg);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
