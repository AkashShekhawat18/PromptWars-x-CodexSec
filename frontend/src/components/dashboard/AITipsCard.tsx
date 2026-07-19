"use client";

import { useState, useEffect } from "react";
import { Lightbulb, X } from "lucide-react";

const TIPS = [
  "Upload a PDF to generate an action plan.",
  "Press Ctrl+K to open the Global Command Palette.",
  "Ask the AI to summarize your latest document.",
  "Use the Workflow Engine to automate repetitive tasks.",
  "Type / to quickly search from anywhere."
];

export function AITipsCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Check localStorage
    const dismissedAt = localStorage.getItem("ai_tip_dismissed_at");
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const now = Date.now();
      // Show again after 24 hours
      if (now - dismissedTime > 24 * 60 * 60 * 1000) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
    
    // Pick random tip
    setTipIndex(Math.floor(Math.random() * TIPS.length));
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("ai_tip_dismissed_at", Date.now().toString());
  };

  return (
    <div className="bg-gradient-to-r from-[#6C5CE7]/10 to-[#00D2D3]/10 border border-[#6C5CE7]/30 rounded-xl p-4 flex items-start gap-4 relative animate-in fade-in duration-500 mb-6">
      <div className="bg-[#6C5CE7]/20 p-2 rounded-lg shrink-0">
        <Lightbulb className="w-5 h-5 text-[#6C5CE7]" />
      </div>
      <div className="flex-1 pr-6">
        <h3 className="text-sm font-semibold text-white mb-1">AI Tip</h3>
        <p className="text-sm text-[#A0A0A5]">{TIPS[tipIndex]}</p>
      </div>
      <button 
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-[#A0A0A5] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7] rounded"
        aria-label="Dismiss tip"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
