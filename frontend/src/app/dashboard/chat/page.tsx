"use client";

import { useSearchParams } from "next/navigation";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Suspense } from "react";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || undefined;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Sidebar for recent conversations */}
      <ChatSidebar />
      
      {/* Main chat area */}
      <div className="flex-1 min-w-0 bg-[#030303]">
        <ChatInterface initialPrompt={initialPrompt} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-64px)] w-full bg-[#030303]" />}>
      <ChatContent />
    </Suspense>
  );
}
