"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, ArrowUp, Square } from "lucide-react";
import { clsx } from "clsx";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
  onStop?: () => void;
  initialValue?: string;
}

export function PromptInput({ onSubmit, isProcessing, onStop, initialValue = "" }: PromptInputProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInputValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    onSubmit(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative group">
      <form 
        onSubmit={handleSubmit}
        className={clsx(
          "relative flex items-end w-full bg-[#16161A]/80 backdrop-blur-2xl border rounded-3xl transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-2",
          isProcessing ? "border-[#6C5CE7]/30" : "border-white/10 hover:border-white/20 focus-within:border-white/30 focus-within:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        )}
      >
        <button 
          type="button"
          aria-label="Voice input"
          className="p-3 shrink-0 rounded-full text-[#A0A0A5] hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50"
        >
          <Mic className="w-5 h-5" />
        </button>
        
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isProcessing ? "Generating insights..." : "Ask NeuroFlow to organize your day, search notes, or build workflows..."}
          className="flex-1 max-h-[200px] min-h-[44px] py-3 px-2 bg-transparent text-white placeholder:text-[#A0A0A5] font-sans text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50 rounded-sm resize-none"
          rows={1}
          disabled={isProcessing}
        />

        <div className="p-1 shrink-0">
          {isProcessing ? (
            <button 
              type="button"
              onClick={onStop}
              aria-label="Stop generation"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Send message"
              className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50",
                inputValue.trim() 
                  ? "bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] text-white shadow-[0_0_15px_rgba(108,92,231,0.5)]" 
                  : "bg-white/5 text-[#A0A0A5] cursor-not-allowed"
              )}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
      <div className="text-center mt-2">
        <span className="text-[10px] text-[#A0A0A5]">NeuroFlow AI can make mistakes. Check important info.</span>
      </div>
    </div>
  );
}
