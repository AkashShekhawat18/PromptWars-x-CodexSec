"use client";

import { useState } from "react";
import { Search, Filter, Sparkles, Loader2 } from "lucide-react";

export function VaultSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [answer, setAnswer] = useState<{ answer: string; sources: string[] } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setAnswer(null);

    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnswer(data);
    } catch (_err) {
      setAnswer({ answer: "⚠️ Failed to search knowledge vault.", sources: [] });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4 w-full">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 className="h-5 w-5 text-[#00D2D3] animate-spin" />
            ) : (
              <Search className="h-5 w-5 text-[#A0A0A5]" />
            )}
          </div>
          <input
            type="text"
            value={query}
            aria-label="Search query"
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isSearching ? "AI is understanding your document..." : "Search documents, text, or semantic concepts..."}
            className="block w-full pl-11 pr-4 py-3 bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-[#A0A0A5] focus-visible:outline-none focus-visible:border-[#00D2D3]/50 focus-visible:ring-2 focus-visible:ring-[#00D2D3]/50 transition-colors shadow-sm"
          />
        </div>
        
        <button 
          type="button"
          className="flex items-center gap-2 px-4 py-3 bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/10 rounded-xl text-[#A0A0A5] hover:text-white hover:border-white/20 transition-all shrink-0 w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2D3]/50"
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium text-sm">Filters</span>
        </button>
      </form>

      {answer && (
        <div className="p-5 bg-gradient-to-br from-[#6C5CE7]/10 to-[#00D2D3]/10 border border-[#00D2D3]/30 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#00D2D3]" />
            <h3 className="text-sm font-semibold text-white">AI Synthesis</h3>
          </div>
          <p className="text-sm text-white/90 leading-relaxed mb-4">{answer.answer}</p>
          {answer.sources && answer.sources.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {answer.sources.map((src, i) => (
                <span key={i} className="px-2 py-1 bg-black/40 border border-white/10 rounded text-xs text-[#A0A0A5]">
                  {src}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
