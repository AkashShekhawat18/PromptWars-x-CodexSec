"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageType, MessageBubble } from "./MessageBubble";
import { PromptInput } from "./PromptInput";
import { ChatEmptyState } from "./ChatEmptyState";
import { v4 as uuidv4 } from "uuid";

export function ChatInterface({ initialPrompt }: { initialPrompt?: string }) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoSubmitted = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-submit if navigated here with a prompt (e.g. from dashboard command center)
  useEffect(() => {
    if (initialPrompt && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      handlePromptSubmit(initialPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    // 1. Add user message
    const userMsg: MessageType = { id: uuidv4(), role: "user", content: prompt };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsProcessing(true);

    // 2. Add thinking state
    const thinkingId = uuidv4();
    setMessages(prev => [...prev, { id: thinkingId, role: "ai", content: "", isThinking: true }]);

    // 3. Call the streaming API
    const aiMsgId = uuidv4();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role === "ai" ? "model" : "user", content: m.content })),
        }),
        signal: controller.signal,
      });

      // Remove thinking bubble
      setMessages(prev => prev.filter(m => m.id !== thinkingId));

      // Handle non-streaming error response
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Request failed" }));
        setMessages(prev => [
          ...prev,
          { id: aiMsgId, role: "ai", content: `⚠️ ${errorData.error || "Something went wrong. Please try again."}`, isStreaming: false },
        ]);
        setIsProcessing(false);
        return;
      }

      // 4. Stream the response
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullText = "";

      // Add the AI message bubble in streaming mode
      setMessages(prev => [
        ...prev,
        { id: aiMsgId, role: "ai", content: "", isStreaming: true, sources: [] },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(line => line.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6); // Remove "data: "

          if (data === "[DONE]") {
            // Streaming complete
            setMessages(prev =>
              prev.map(m => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
            );
            break;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              setMessages(prev =>
                prev.map(m =>
                  m.id === aiMsgId ? { ...m, content: `⚠️ ${parsed.error}`, isStreaming: false } : m
                )
              );
              break;
            }

            if (parsed.text) {
              fullText += parsed.text;
              setMessages(prev =>
                prev.map(m => (m.id === aiMsgId ? { ...m, content: fullText } : m))
              );
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }

      // Finalize streaming state
      setMessages(prev =>
        prev.map(m => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
      );
    } catch (error: unknown) {
      // Remove thinking bubble if still present
      setMessages(prev => prev.filter(m => m.id !== thinkingId));

      if (error instanceof Error && error.name === "AbortError") {
        // User cancelled — mark any streaming message as done
        setMessages(prev =>
          prev.map(m => (m.isStreaming ? { ...m, isStreaming: false } : m))
        );
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: aiMsgId,
            role: "ai",
            content: `⚠️ ${(error as Error).message || "Network error. Please check your connection and try again."}`,
            isStreaming: false,
          },
        ]);
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [messages]);

  const handleStopProcessing = () => {
    abortControllerRef.current?.abort();
    setIsProcessing(false);
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
  };

  return (
    <div className="flex flex-col h-full bg-[#030303] relative">
      
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col pt-10">
            <ChatEmptyState onSelectPrompt={handlePromptSubmit} />
          </div>
        ) : (
          <div className="pb-32 pt-8">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky input area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent pt-10">
        <PromptInput 
          onSubmit={handlePromptSubmit} 
          isProcessing={isProcessing} 
          onStop={handleStopProcessing} 
        />
      </div>

    </div>
  );
}
