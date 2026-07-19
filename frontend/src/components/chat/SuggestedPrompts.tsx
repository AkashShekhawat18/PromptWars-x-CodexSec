"use client";

import { Sparkles, Calendar, Search, Workflow } from "lucide-react";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const prompts = [
  { id: 1, text: "Schedule deep-work blocks for next week", icon: Calendar, color: "text-[#6C5CE7]" },
  { id: 2, text: "Find all emails from Liam regarding branding", icon: Search, color: "text-[#00D2D3]" },
  { id: 3, text: "Create a new document for marketing ideas", icon: Sparkles, color: "text-[#00B894]" },
  { id: 4, text: "Draft a workflow to triage my inbox", icon: Workflow, color: "text-[#FF7675]" },
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mx-auto mt-8">
      {prompts.map((prompt) => {
        const Icon = prompt.icon;
        return (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt.text)}
            className="flex items-center gap-3 p-4 rounded-xl bg-[#16161A]/50 hover:bg-[#16161A] border border-white/5 hover:border-white/10 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0C0C0E] border border-white/5 flex items-center justify-center shrink-0">
              <Icon className={`w-4 h-4 ${prompt.color}`} />
            </div>
            <span className="text-sm text-[#A0A0A5] group-hover:text-white transition-colors">{prompt.text}</span>
          </button>
        );
      })}
    </div>
  );
}
