"use client";

import { useState } from "react";
import { Mic, Command } from "lucide-react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

export function CommandCenterWidget() {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Navigate to the chat page with the prompt as a query parameter
    const encoded = encodeURIComponent(inputValue.trim());
    router.push(`/dashboard/chat?prompt=${encoded}`);
    setInputValue("");
  };

  return (
    <div className="w-full mb-8">
      <form 
        onSubmit={handleSubmit}
        className={clsx(
          "relative flex items-center w-full h-14 bg-[#0C0C0E]/75 backdrop-blur-xl border rounded-2xl transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          isFocused
            ? "border-[#00D2D3]/50 shadow-[0_0_20px_rgba(0,210,211,0.2)]"
            : "border-white/10 hover:border-white/20"
        )}
      >
        <div className="pl-4 pr-3 text-[#A0A0A5]">
          <Command className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What are we building today? Try: 'Organize my week'..."
          className="flex-1 h-full bg-transparent text-white placeholder:text-[#A0A0A5] font-sans text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50 rounded-sm"
        />

        <div className="pr-2 pl-2">
          <button 
            type="button"
            aria-label="Voice input"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-[#A0A0A5] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Floating suggestion pill (desktop only) */}
        <div className="absolute right-12 hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-[#A0A0A5]">⌘</span>
          <span className="text-[10px] font-mono text-[#A0A0A5]">K</span>
        </div>
      </form>
    </div>
  );
}
