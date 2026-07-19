"use client";

import { useState } from "react";
import { Brain, Search, Loader2, FileText, CheckCircle, MessageSquare, Network } from "lucide-react";

export default function SecondBrainPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ answer: string; sources: any[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/second-brain/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "TASK": return <CheckCircle className="w-4 h-4 text-[#00D2D3]" />;
      case "DOC_INSIGHT": return <FileText className="w-4 h-4 text-[#6C5CE7]" />;
      case "CHAT": return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      default: return <Network className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#030303] text-white p-6">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] flex items-center justify-center shadow-[0_0_20px_rgba(108,92,231,0.3)]">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Second Brain</h1>
            <p className="text-[#A0A0A5] text-sm">Semantic search across your chats, tasks, and document insights.</p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your past work..."
            className="w-full bg-[#0C0C0E] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#A0A0A5] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7]/50 transition-all shadow-xl"
          />
          <Search className="w-5 h-5 text-[#A0A0A5] absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ask AI"}
          </button>
        </form>

        {/* Results Area */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-20">
          {!result && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <Brain className="w-16 h-16 text-white/5" />
              <p className="text-[#A0A0A5] max-w-sm">
                I remember everything you do in NeuroFlow. Ask me what you worked on last week, or to find specific notes.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#00D2D3] animate-spin"></div>
              <p className="text-[#A0A0A5] animate-pulse">Searching your semantic memory...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Answer Card */}
              <div className="bg-[#0C0C0E] border border-[#6C5CE7]/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6C5CE7] to-[#00D2D3]" />
                <h2 className="text-sm font-semibold text-[#A0A0A5] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> AI Synthesis
                </h2>
                <div className="prose prose-invert max-w-none">
                  {result.answer.split('\n').map((line, i) => (
                    <p key={i} className="text-white/90 leading-relaxed mb-2">{line}</p>
                  ))}
                </div>
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#A0A0A5] uppercase tracking-wider pl-2">
                    Retrieved Context
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.sources.map((source, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-black/40 border border-white/5 w-fit">
                            {getIconForType(source.type)}
                            <span className="text-xs font-bold text-white/80">{source.type}</span>
                          </div>
                          <span className="text-[10px] font-mono text-[#00D2D3]">Match: {(source.similarity * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-sm text-[#A0A0A5] line-clamp-4 leading-relaxed">
                          {source.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
