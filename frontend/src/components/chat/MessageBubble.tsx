"use client";

import { clsx } from "clsx";
import { FileText, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export interface MessageType {
  id: string;
  role: "user" | "ai";
  content: string;
  isStreaming?: boolean;
  isThinking?: boolean;
  sources?: string[];
}

export function MessageBubble({ message }: { message: MessageType }) {
  const isUser = message.role === "user";

  if (message.isThinking) {
    return (
      <div className="flex w-full py-6">
        <div className="flex gap-4 max-w-3xl mx-auto w-full px-4">
          <div className="w-8 h-8 rounded-full bg-[#0C0C0E] border border-white/10 flex items-center justify-center shrink-0">
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] animate-pulse blur-[1px]"></div>
          </div>
          <div className="flex items-center text-[#A0A0A5] text-sm">
            Searching Knowledge Vault...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("flex w-full py-6 transition-colors", !isUser && "bg-white/[0.02]")}>
      <div className="flex gap-4 max-w-3xl mx-auto w-full px-4">
        
        {/* Avatar */}
        <div className="shrink-0">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border border-white/10 flex items-center justify-center overflow-hidden">
              <span className="text-xs text-white/70 font-medium">U</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] flex items-center justify-center shadow-[0_0_15px_rgba(108,92,231,0.3)]">
              <span className="text-white font-bold text-xs">NF</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 pt-1">
          <div className={clsx(
            "text-[15px] leading-relaxed text-white prose prose-invert max-w-none",
            message.isStreaming && "animate-pulse"
          )}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && <span className="inline-block w-2 h-4 bg-[#00D2D3] ml-1 align-middle animate-pulse"></span>}
          </div>

          {/* Sources / References Section */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs font-semibold text-[#A0A0A5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Search className="w-3 h-3" /> Referenced Context
              </p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#16161A] border border-white/5 rounded-lg hover:border-[#6C5CE7]/30 transition-colors cursor-pointer group">
                    <FileText className="w-3.5 h-3.5 text-[#00D2D3] group-hover:text-[#6C5CE7] transition-colors" />
                    <span className="text-xs text-[#A0A0A5] group-hover:text-white transition-colors">{source}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
