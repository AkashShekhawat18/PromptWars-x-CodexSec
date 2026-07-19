import { searchKnowledge } from "@/lib/gemini";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateEmbedding, cosineSimilarity } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query string is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return Response.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    // 1. Embed query
    const queryEmbedding = await generateEmbedding(query);

    // 2. Fetch all chunks (in-memory search since we lack pgvector locally)
    const chunks = await prisma.documentChunk.findMany({
      include: { document: true }
    });

    // 3. Compute similarity
    const scoredChunks = chunks.map(chunk => {
      const docEmbedding = JSON.parse(chunk.embedding);
      const score = cosineSimilarity(queryEmbedding, docEmbedding);
      return { ...chunk, score };
    });

    // 4. Sort and take top 5
    scoredChunks.sort((a, b) => b.score - a.score);
    const topChunks = scoredChunks.slice(0, 5);

    // 5. Build context
    const context = topChunks.map(c => `[Source: ${c.document.originalName}]\n${c.content}`).join("\n\n---\n\n");

    const result = await searchKnowledge(query, context);
    return Response.json(result);
  } catch (error: unknown) {
    console.error("[AI Search Error]", error);
    return Response.json(
      { error: (error as Error).message || "Failed to search knowledge vault" },
      { status: 500 }
    );
  }
}
