"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, CheckCircle, FileText, MessageSquare, Workflow } from "lucide-react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

export function QuickCreateMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleAction = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40" ref={menuRef}>
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-4 w-48 bg-[#0C0C0E]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="space-y-1">
            <button
              onClick={() => handleAction("/dashboard")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-[#00B894]" />
              Create Task
            </button>
            <button
              onClick={() => handleAction("/dashboard/vault")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#0984E3]" />
              Upload Document
            </button>
            <button
              onClick={() => handleAction("/dashboard/chat")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#E84393]" />
              Start AI Chat
            </button>
            <button
              onClick={() => handleAction("/dashboard/workflows")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <Workflow className="w-4 h-4 text-[#6C5CE7]" />
              New Workflow
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick create menu"
        className={clsx(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(108,92,231,0.4)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
          isOpen ? "bg-[#333] rotate-45" : "bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] hover:scale-105 hover:shadow-[0_0_30px_rgba(108,92,231,0.6)]"
        )}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
