import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const NEUROFLOW_SYSTEM_PROMPT = `You are NeuroFlow, an elite autonomous AI productivity operating system.
You are concise, direct, and action-oriented. You help users manage tasks, search their knowledge vault, plan projects, and automate workflows.

Guidelines:
- Be concise and professional. Use short paragraphs and bullet points.
- When creating tasks, output valid JSON arrays.
- When summarizing documents, extract key points, action items, and decisions.
- Never hallucinate facts. If you don't know something, say so clearly.
- Format responses with markdown for readability.`;
// ---------------------------------------------------------
// Retry Utility for Gemini API
// ---------------------------------------------------------
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, delayMs = 1000): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: unknown) {
      attempt++;
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`[Gemini API] Attempt ${attempt} failed: ${errorMessage}`);
      if (attempt >= maxRetries) throw error;
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt - 1)));
    }
  }
  throw new Error("Unreachable");
}
// ---------------------------------------------------------
// Streaming Chat
// ---------------------------------------------------------
export async function streamChat(
  messages: { role: string; content: string }[],
  systemPrompt?: string
): Promise<ReadableStream<Uint8Array>> {
  const contents = messages.map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.content }],
  }));

  const response = await genAI.models.generateContentStream({
    model: "gemini-3.5-flash",
    contents,
    config: {
      systemInstruction: systemPrompt || NEUROFLOW_SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
          
          // Try to capture and log usage metadata if present in the final chunk
          if (chunk.usageMetadata) {
            const usage = chunk.usageMetadata;
            console.log(`[Token Usage | Chat] Prompt: ${usage.promptTokenCount}, Candidates: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`);
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error: unknown) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: (error as Error).message || "Stream failed" })}\n\n`)
        );
        controller.close();
      }
    },
  });
}

// ---------------------------------------------------------
// Document Summarization
// ---------------------------------------------------------
export async function summarizeDocument(content: string): Promise<{
  summary: string;
  keyPoints: string[];
  actionItems: string[];
}> {
  const response = await withRetry(() => genAI.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Summarize the following document. Return your response as JSON with this exact structure:
{
  "summary": "A 2-3 sentence executive summary",
  "keyPoints": ["point 1", "point 2", ...],
  "actionItems": ["action 1", "action 2", ...]
}

Document content:
${content}`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: NEUROFLOW_SYSTEM_PROMPT,
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  }));

  if (response.usageMetadata) {
    const usage = response.usageMetadata;
    console.log(`[Token Usage | Summarize] Prompt: ${usage.promptTokenCount}, Candidates: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`);
  }

  const text = response.text || "{}";
  return JSON.parse(text);
}

// ---------------------------------------------------------
// Task Planning
// ---------------------------------------------------------
export async function planTasks(
  goal: string
): Promise<{ title: string; priority: string; description: string }[]> {
  const response = await withRetry(() => genAI.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Break down the following goal into actionable tasks. Return a JSON array with this structure:
[{ "title": "Task title", "priority": "HIGH|MEDIUM|LOW", "description": "Brief description" }]

Goal: ${goal}`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: NEUROFLOW_SYSTEM_PROMPT,
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  }));

  if (response.usageMetadata) {
    const usage = response.usageMetadata;
    console.log(`[Token Usage | Plan Tasks] Prompt: ${usage.promptTokenCount}, Candidates: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`);
  }

  const text = response.text || "[]";
  return JSON.parse(text);
}

// ---------------------------------------------------------
// Knowledge Search
// ---------------------------------------------------------
export async function searchKnowledge(
  query: string,
  context?: string
): Promise<{ answer: string; sources: string[] }> {
  const contextBlock = context
    ? `\n\nAvailable context from Knowledge Vault:\n${context}`
    : "\n\nNo documents are currently loaded in the Knowledge Vault.";

  const response = await withRetry(() => genAI.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Answer the following question using ONLY the provided context. If the answer cannot be found in the context, state that clearly.
IMPORTANT: You MUST include inline citations in your answer referring to the source documents using the format [Source: Document Name].
Return JSON:
{ "answer": "your answer with [Source: Document Name] citations", "sources": ["source document names referenced"] }

Question: ${query}${contextBlock}`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: NEUROFLOW_SYSTEM_PROMPT,
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  }));

  if (response.usageMetadata) {
    const usage = response.usageMetadata;
    console.log(`[Token Usage | Search] Prompt: ${usage.promptTokenCount}, Candidates: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`);
  }

  const text = response.text || '{"answer": "Unable to process", "sources": []}';
  return JSON.parse(text);
}

// ---------------------------------------------------------
// Executive Brief
// ---------------------------------------------------------
export async function generateExecutiveBrief(
  userName: string,
  tasksCount: number,
  meetingsCount: number,
  docsCount: number
): Promise<{ recommendation: string; focusTime: string; suggestedActions: string[] }> {
  const response = await withRetry(() => genAI.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Generate a personalized executive brief for ${userName}.
They have ${tasksCount} tasks, ${meetingsCount} meetings, and ${docsCount} documents.
Provide a JSON object with:
1. "recommendation": A short 1-sentence recommendation on what to focus on today.
2. "focusTime": An estimated focus time string (e.g., "3h 15m").
3. "suggestedActions": An array of 3-4 short, punchy suggested actions like "Plan today's schedule", "Review 2 documents".

Return ONLY JSON:
{ "recommendation": "...", "focusTime": "...", "suggestedActions": ["...", "..."] }`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: NEUROFLOW_SYSTEM_PROMPT,
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  }));

  if (response.usageMetadata) {
    const usage = response.usageMetadata;
    console.log(`[Token Usage | Executive Brief] Prompt: ${usage.promptTokenCount}, Candidates: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`);
  }

  const text = response.text || '{"recommendation": "Focus on your top priority tasks.", "focusTime": "2h 30m", "suggestedActions": []}';
  return JSON.parse(text);
}
