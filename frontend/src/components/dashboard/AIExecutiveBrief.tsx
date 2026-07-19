"use client";

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Clock, FileText, Loader2 } from "lucide-react";

interface BriefData {
  greeting: string;
  tasksCount: number;
  meetingsCount: number;
  docsCount: number;
  recommendation: string;
  focusTime: string;
  suggestedActions: string[];
}

export function AIExecutiveBrief() {
  const [data, setData] = useState<BriefData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      try {
        const res = await fetch("/api/ai/executive-brief");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch executive brief", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrief();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-[#A0A0A5] mb-8 p-6 bg-white/5 rounded-2xl animate-pulse">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">AI is analyzing your day...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-6 bg-[#0C0C0E]/75 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Left Side: Stats */}
        <div className="flex-1">
          <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
            {data.greeting}
          </h2>
          <p className="text-sm text-[#A0A0A5] mb-4">Today you have:</p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00B894]" />
              <span className="text-sm font-medium text-white">{data.tasksCount} Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FDCB6E]" />
              <span className="text-sm font-medium text-white">{data.meetingsCount} Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0984E3]" />
              <span className="text-sm font-medium text-white">{data.docsCount} Documents waiting</span>
            </div>
          </div>
        </div>

        {/* Right Side: AI Recommendation */}
        <div className="flex-1 lg:border-l lg:border-white/5 lg:pl-6 mt-6 lg:mt-0">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#00D2D3]" />
            <span className="text-xs font-semibold text-[#00D2D3] uppercase tracking-wider">AI Recommendation</span>
          </div>
          <p className="text-base text-white font-medium mb-3">
            {data.recommendation}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A0A0A5]">Estimated focus time</span>
            <span className="text-sm font-bold text-[#6C5CE7] bg-[#6C5CE7]/10 px-2 py-1 rounded">
              {data.focusTime}
            </span>
          </div>
        </div>
      </div>

      {/* Contextual Suggested Actions */}
      {data.suggestedActions.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {data.suggestedActions.map((action, idx) => (
            <button
              key={idx}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#A0A0A5] bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 hover:border-[#6C5CE7]/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]"
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
