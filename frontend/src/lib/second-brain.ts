import { prisma } from "@/lib/prisma";
import { generateEmbedding, cosineSimilarity } from "@/lib/embeddings";

export type NodeType = "CHAT" | "NOTE" | "DOC_INSIGHT" | "MEETING" | "TASK";

export async function saveToBrain(userId: string, nodeType: NodeType, content: string, sourceId?: string) {
  try {
    const embeddingArray = await generateEmbedding(content);
    if (!embeddingArray.length) return null;

    const embeddingStr = JSON.stringify(embeddingArray);
    
    return await prisma.brainNode.create({
      data: {
        userId,
        nodeType,
        content,
        sourceId,
        embedding: embeddingStr,
      }
    });
  } catch (error) {
    console.error("[SecondBrain] Save Error:", error);
    return null;
  }
}

export async function searchBrain(userId: string, query: string, limit = 5, minSimilarity = 0.6) {
  try {
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding.length) return [];

    // Fetch all nodes for user to do in-memory similarity (since we are on Option 3 without pgvector)
    const nodes = await prisma.brainNode.findMany({
      where: { userId },
      select: { id: true, nodeType: true, content: true, sourceId: true, embedding: true, createdAt: true }
    });

    const results = nodes
      .map(node => {
        let similarity = 0;
        if (node.embedding) {
          try {
            const vec = JSON.parse(node.embedding);
            similarity = cosineSimilarity(queryEmbedding, vec);
          } catch (e) {
            // ignore parse error
          }
        }
        return { ...node, similarity };
      })
      .filter(node => node.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error("[SecondBrain] Search Error:", error);
    return [];
  }
}
