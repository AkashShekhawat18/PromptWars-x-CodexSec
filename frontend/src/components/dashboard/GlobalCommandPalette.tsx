"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Calendar, Network, Workflow, Settings, CheckCircle, FileText, MessageSquare, X, Brain } from "lucide-react";
import { clsx } from "clsx";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
}

const STATIC_COMMANDS = [
  { id: "cmd-1", type: "Navigation", title: "Open Planner", subtitle: "Adaptive Planner", href: "/dashboard/planner", icon: "Calendar" },
  { id: "cmd-2", type: "Navigation", title: "Open Knowledge Vault", subtitle: "Knowledge Vault", href: "/dashboard/vault", icon: "Network" },
  { id: "cmd-3", type: "Navigation", title: "Open Workflow Engine", subtitle: "Workflow Engine", href: "/dashboard/workflows", icon: "Workflow" },
  { id: "cmd-sb", type: "Navigation", title: "Open Second Brain", subtitle: "Semantic Search", href: "/dashboard/second-brain", icon: "Brain" },
  { id: "cmd-4", type: "Action", title: "Start AI Chat", subtitle: "Command Center", href: "/dashboard/chat", icon: "MessageSquare" },
  { id: "cmd-5", type: "Navigation", title: "Settings", subtitle: "Manage Account", href: "#settings", icon: "Settings" },
];

export function GlobalCommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayResults = query.trim() ? results : STATIC_COMMANDS;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsLoading(false);
        setSelectedIndex(0);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleAction = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      // Handle static anchor actions like #settings
      return;
    }
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < displayResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (displayResults[selectedIndex]) {
        handleAction(displayResults[selectedIndex].href);
      }
    }
  };

  if (!isOpen) return null;

  const renderIcon = (iconStr: string) => {
    switch (iconStr) {
      case "Calendar": return <Calendar className="w-5 h-5" />;
      case "Network": return <Network className="w-5 h-5" />;
      case "Workflow": return <Workflow className="w-5 h-5" />;
      case "Settings": return <Settings className="w-5 h-5" />;
      case "CheckCircle": return <CheckCircle className="w-5 h-5" />;
      case "FileText": return <FileText className="w-5 h-5" />;
      case "MessageSquare": return <MessageSquare className="w-5 h-5" />;
      case "Brain": return <Brain className="w-5 h-5" />;
      default: return <Search className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-[#0C0C0E]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-4 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-white/5">
          <Search className="w-5 h-5 text-[#A0A0A5] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tasks, documents, or type a command..."
            className="flex-1 bg-transparent border-none text-white px-4 py-2 focus:outline-none placeholder:text-[#A0A0A5]"
          />
          {isLoading && <Loader2 className="w-5 h-5 text-[#00D2D3] animate-spin shrink-0" />}
          <div className="flex gap-1 ml-2 shrink-0">
            <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-[#A0A0A5]">ESC</span>
          </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {displayResults.length === 0 && query.trim() && !isLoading ? (
            <div className="p-8 text-center text-[#A0A0A5]">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {displayResults.map((result, idx) => (
                <button
                  key={result.id}
                  onClick={() => handleAction(result.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={clsx(
                    "w-full flex items-center gap-4 p-3 rounded-xl transition-colors text-left",
                    selectedIndex === idx ? "bg-white/10 text-white" : "text-[#A0A0A5] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className={clsx(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    selectedIndex === idx ? "bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] text-white" : "bg-white/5"
                  )}>
                    {renderIcon(result.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    <p className="text-xs opacity-70 truncate">{result.type} • {result.subtitle}</p>
                  </div>
                  {selectedIndex === idx && (
                    <span className="text-xs text-[#00D2D3] mr-2 shrink-0">Select</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
