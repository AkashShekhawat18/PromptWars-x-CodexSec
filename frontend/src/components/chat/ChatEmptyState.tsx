"use client";

import { SuggestedPrompts } from "./SuggestedPrompts";

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export function ChatEmptyState({ onSelectPrompt }: ChatEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 mt-12">
      
      {/* Orb Simulation */}
      <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7] to-[#00D2D3] rounded-full blur-[2px] opacity-80 animate-pulse"></div>
        <div className="absolute inset-2 bg-gradient-to-tr from-[#6C5CE7] to-[#00D2D3] rounded-full blur-[8px] opacity-60"></div>
        <div className="relative w-16 h-16 bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(108,92,231,0.5)]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-display font-medium text-white mb-2 text-center">How can I help you focus today?</h2>
      <p className="text-[#A0A0A5] text-center mb-8 max-w-md">
        NeuroFlow AI can manage your tasks, search your knowledge vault, and schedule your calendar automatically.
      </p>

      <SuggestedPrompts onSelect={onSelectPrompt} />
      
    </div>
  );
}
